/**
 * RAG Retrieval Engine
 * 
 * Semantic search and retrieval module for the Nous RAG system.
 * Performs similarity-based retrieval over the misconception knowledge base
 * using embeddings and cosine similarity scoring.
 * 
 * Key Functions:
 * - retrieveOne(step): Semantic search returning top-1 misconception match
 * - retrieve(step, topK): Flexible top-K retrieval for batch operations
 * - buildIndex(): Lazy-initialized embedding cache for performance
 * 
 * Design Notes:
 * - Embeddings cached in-process; serialize to persistent store in production
 * - Query text built from step title, type, subject, and prompt
 * - Supports arbitrary K values for flexibility
 */

import { KNOWLEDGE_BASE } from './knowledge-base';
import { embedText, cosineSimilarity, docToEmbeddingText } from './embeddings';
import type { MisconceptionDoc, ScoredDoc, RetrievedContext } from './types';

// ─── Lazy-initialized embedded index ─────────────────────────────────────────
// Embeddings are computed once on first retrieve() call and cached for the
// lifetime of the Node.js process. In production, serialize and store these.

interface IndexedDoc {
  doc: MisconceptionDoc;
  embedding: number[];
}

let embeddedIndex: IndexedDoc[] | null = null;
let indexBuildPromise: Promise<IndexedDoc[]> | null = null;

async function buildIndex(): Promise<IndexedDoc[]> {
  const results = await Promise.all(
    KNOWLEDGE_BASE.map(async (doc) => {
      const text = docToEmbeddingText(doc);
      const embedding = await embedText(text, 'RETRIEVAL_DOCUMENT');
      return { doc, embedding };
    }),
  );
  return results;
}

async function getIndex(): Promise<IndexedDoc[]> {
  if (embeddedIndex) return embeddedIndex;
  // Deduplicate concurrent calls
  if (!indexBuildPromise) {
    indexBuildPromise = buildIndex().then((idx) => {
      embeddedIndex = idx;
      indexBuildPromise = null;
      return idx;
    });
  }
  return indexBuildPromise;
}

// ─── Query builder ────────────────────────────────────────────────────────────

export interface StepInput {
  title: string;
  prompt: string;
  type: 'Conceptual' | 'Procedural' | 'Calculation';
  subject?: string; // optional hint from the assignment context
}

function buildQueryText(step: StepInput): string {
  const parts = [
    `Step: ${step.title}`,
    `Type: ${step.type}`,
    step.subject ? `Subject: ${step.subject}` : '',
    step.prompt ? `Task: ${step.prompt}` : '',
  ].filter(Boolean);
  return parts.join('\n');
}

// ─── Top-1 retrieval — primary function ──────────────────────────────────────
// Single pass through the index; no sort needed for k=1.

export async function retrieveOne(step: StepInput): Promise<ScoredDoc | null> {
  const queryText = buildQueryText(step);
  const [index, queryEmbedding] = await Promise.all([
    getIndex(),
    embedText(queryText, 'RETRIEVAL_QUERY'),
  ]);

  let best: ScoredDoc | null = null;
  for (const { doc, embedding } of index) {
    const score = cosineSimilarity(queryEmbedding, embedding);
    if (best === null || score > best.score) {
      best = { doc, score };
    }
  }
  return best;
}

// ─── Multi-result retrieval — kept for future use ────────────────────────────

export async function retrieve(
  step: StepInput,
  topK = 1,
): Promise<RetrievedContext> {
  const queryText = buildQueryText(step);
  const [index, queryEmbedding] = await Promise.all([
    getIndex(),
    embedText(queryText, 'RETRIEVAL_QUERY'),
  ]);

  const scored: ScoredDoc[] = index
    .map(({ doc, embedding }) => ({
      doc,
      score: cosineSimilarity(queryEmbedding, embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return { topDocs: scored, queryText };
}

// ─── Format for Gemini prompt injection ──────────────────────────────────────
// Accepts either a single ScoredDoc (from retrieveOne) or a full RetrievedContext.

export function formatContextForPrompt(
  input: ScoredDoc | RetrievedContext | null,
): string {
  if (!input) return '';

  const docs: ScoredDoc[] =
    'doc' in input ? [input] : input.topDocs;

  if (docs.length === 0) return '';

  const lines: string[] = [
    '=== RETRIEVED MISCONCEPTION PATTERN ===',
    'Use this documented misconception to ground the wrong MCQ options.',
    '',
  ];

  const { doc } = docs[0];
  lines.push(`Concept: ${doc.concept}`);
  lines.push(`Error type: ${doc.errorCategory}`);
  lines.push(`What students get wrong: ${doc.studentBehavior}`);
  lines.push(`Correct reasoning: ${doc.correctReasoning}`);
  lines.push(`Distractor seed: "${doc.distractorSeed}"`);
  lines.push(`Teaching note: ${doc.teachingNote}`);
  lines.push('');
  lines.push('========================================');
  return lines.join('\n');
}
