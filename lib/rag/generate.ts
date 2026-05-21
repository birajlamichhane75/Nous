import { GoogleGenAI, Type } from '@google/genai';
import type { Schema } from '@google/genai';
import { retrieveOne, formatContextForPrompt } from './retrieval';
import type { StepInput } from './retrieval';
import type { ScoredDoc } from './types';
import { logger } from '../logger';

// ─── Output types ─────────────────────────────────────────────────────────────

type ErrorType = 'correct' | 'conceptual' | 'calculation' | 'misconception';

export interface MCQOption {
  id: string;   // 'a' | 'b' | 'c' | 'd'
  text: string;
  type: ErrorType;
}

export interface GeneratedCrossQuestion {
  question: string;
  options: MCQOption[];        // shuffled, A–D labeled
  retrievedDocId: string | null;
  retrievalScore: number | null;
}

// Raw shape Gemini returns before we shuffle and label
interface RawOption { text: string; type: ErrorType; }
interface RawOutput { question: string; options: RawOption[]; }

// ─── Response schema ──────────────────────────────────────────────────────────

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  required: ['question', 'options'],
  properties: {
    question: { type: Type.STRING },
    options: {
      type: Type.ARRAY,
      minItems: '4',
      maxItems: '4',
      items: {
        type: Type.OBJECT,
        required: ['text', 'type'],
        properties: {
          text: { type: Type.STRING },
          type: {
            type: Type.STRING,
            enum: ['correct', 'conceptual', 'calculation', 'misconception'],
          },
        },
      },
    },
  },
};

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildSystemPrompt(best: ScoredDoc | null): string {
  const ragBlock = formatContextForPrompt(best);
  const coveredCategory = best?.doc.errorCategory ?? null;

  // Build the system prompt that will be sent to Gemini
  return `You are a diagnostic cross-question generator for Nous, a student learning platform.

TASK
Generate a single 4-option MCQ that asks WHY a student took a specific step — not what comes next, not the correct answer.
The question must probe the REASONING behind the completed step.

OPTION TYPES — exactly one of each, no duplicates:
  "correct"       — the actual principle or property that makes this step valid
  "conceptual"    — misunderstands the purpose or meaning of the step
  "calculation"   — confuses a specific value, operation, or quantity
  "misconception" — holds a false belief about the underlying concept

${ragBlock ? `RETRIEVED MISCONCEPTION PATTERN
${ragBlock}
CRITICAL: The pattern above documents a real, research-backed student error for the "${coveredCategory}" slot.
You MUST base the "${coveredCategory}" option directly on the distractor seed shown above.
Do not invent a different wrong reasoning for that slot.
Generate the remaining three option types from first principles for this specific step.
` : ''}QUALITY RULES
  Question: ≤ 12 words. Opens with "Why", "What justifies", or "What makes this". Never reveal the correct answer in the question.
  Option text: 8–20 words each. One complete thought. No A/B/C/D labels.
  Each wrong option must be wrong for a DISTINCT reason — one logic error, one value/operation error, one false belief.
  All options must sound like things a real student at this level would genuinely think.
  Do not echo vocabulary from the question into the correct option.

Return JSON only — no markdown fences, no prose.`;
}

// ─── Fisher-Yates shuffle + label ────────────────────────────────────────────

function shuffleAndLabel(options: RawOption[]): MCQOption[] {
  const arr = [...options];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.map((opt, i) => ({
    id: String.fromCharCode(97 + i), // 'a', 'b', 'c', 'd'
    text: opt.text,
    type: opt.type,
  }));
}

// ─── Main generator ───────────────────────────────────────────────────────────

export interface GenerateOptions {
  skipRetrieval?: boolean; // force no RAG context — useful for A/B testing
}

const CONFIDENCE_THRESHOLD = 0.6;

export async function generateCrossQuestion(
  step: StepInput,
  options: GenerateOptions = {},
): Promise<GeneratedCrossQuestion> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  // 1. RAG — find the most semantically relevant misconception doc
  let retrieved: ScoredDoc | null = null;
  let best: ScoredDoc | null = null;

  if (!options.skipRetrieval) {
    retrieved = await retrieveOne(step);
    best = retrieved;

    if (retrieved !== null) {
      logger.retrieval(retrieved.doc.id, retrieved.doc.concept, retrieved.score);

      if (retrieved.score < CONFIDENCE_THRESHOLD) {
        logger.fallback(step.title, retrieved.score, CONFIDENCE_THRESHOLD);
        best = null;
      }
    }
  }

  // 2. User message — what Gemini sees as the "task"
  const userMessage = [
    `Step title: ${step.title}`,
    `Step type: ${step.type}`,
    step.subject ? `Subject: ${step.subject}` : '',
    step.prompt ? `What the student was asked to do: ${step.prompt}` : '',
  ].filter(Boolean).join('\n');

  // 3. Gemini generation
  const ai = new GoogleGenAI({ apiKey });
  const geminiStart = Date.now();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: userMessage,
    config: {
      systemInstruction: buildSystemPrompt(best),
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.4,
    },
  });
  logger.geminiCall(Date.now() - geminiStart);

  // 4. Parse
  let raw: RawOutput;
  try {
    raw = JSON.parse(response.text ?? '{}') as RawOutput;
  } catch {
    logger.geminiParseError(response.text ?? '');
    throw new Error(`Failed to parse Gemini response: ${response.text}`);
  }

  if (!raw.question || !Array.isArray(raw.options) || raw.options.length !== 4) {
    logger.geminiParseError(response.text ?? '');
    throw new Error(`Gemini returned malformed MCQ output: ${response.text}`);
  }

  const result: GeneratedCrossQuestion = {
    question: raw.question,
    options: shuffleAndLabel(raw.options),
    retrievedDocId: best?.doc.id ?? null,    // null if fell back
    retrievalScore: retrieved?.score ?? null, // raw score regardless of fallback
  };
  logger.output(result);
  return result;
}
