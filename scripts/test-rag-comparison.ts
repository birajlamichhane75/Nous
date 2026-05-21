/**
 * RAG comparison test
 * Runs the same step through the generator twice — once with retrieval,
 * once without — and prints both outputs so you can see what the knowledge
 * base actually contributes to the wrong options.
 *
 * Usage:
 *   $env:GEMINI_API_KEY="your-key"; npx tsx scripts/test-rag-comparison.ts
 *
 * Or with a .env.local file:
 *   npx tsx --env-file=.env.local scripts/test-rag-comparison.ts
 */

import { generateCrossQuestion } from '../lib/rag/generate';
import { retrieveOne } from '../lib/rag/retrieval';
import type { StepInput } from '../lib/rag/retrieval';
import type { GeneratedCrossQuestion } from '../lib/rag/generate';

// ─── Test step ────────────────────────────────────────────────────────────────
// "Factor and simplify" from math-2414-3.
// Expected top match: calc-limit-002 (factor cancellation validity).

const TEST_STEP: StepInput = {
  title: 'Factor and simplify',
  prompt:
    'Factor the numerator x²−4 using difference of squares. Then identify what cancels with the denominator, and explain why cancellation is valid here.',
  type: 'Procedural',
  subject: 'calculus',
};

// ─── Formatting helpers ───────────────────────────────────────────────────────

const LINE = '─'.repeat(60);
const BOLD = (s: string) => `\x1b[1m${s}\x1b[0m`;
const DIM  = (s: string) => `\x1b[2m${s}\x1b[0m`;
const GREEN = (s: string) => `\x1b[32m${s}\x1b[0m`;
const YELLOW = (s: string) => `\x1b[33m${s}\x1b[0m`;
const RED    = (s: string) => `\x1b[31m${s}\x1b[0m`;

const TYPE_COLOR: Record<string, (s: string) => string> = {
  correct:     GREEN,
  conceptual:  YELLOW,
  calculation: (s) => `\x1b[36m${s}\x1b[0m`,
  misconception: RED,
};

function printResult(label: string, result: GeneratedCrossQuestion) {
  console.log(`\n${BOLD(label)}`);
  console.log(LINE);

  if (result.retrievedDocId) {
    console.log(BOLD('Retrieved doc: ') + result.retrievedDocId);
    console.log(BOLD('Retrieval score: ') + result.retrievalScore?.toFixed(4));
  } else {
    console.log(DIM('Retrieved doc: none (skipped or fell back)'));
    if (result.retrievalScore !== null) {
      console.log(DIM(`Retrieval score: ${result.retrievalScore.toFixed(4)} (below threshold)`));
    }
  }

  console.log();
  console.log(BOLD('Q: ') + result.question);
  console.log();

  for (const opt of result.options) {
    const color = TYPE_COLOR[opt.type] ?? ((s: string) => s);
    const label = `  ${opt.id.toUpperCase()}. `;
    const tag   = DIM(` [${opt.type}]`);
    console.log(label + color(opt.text) + tag);
  }
}

function printDiff(
  withRag: GeneratedCrossQuestion,
  withoutRag: GeneratedCrossQuestion,
) {
  console.log(`\n${BOLD('DIFF — option texts by error type')}`);
  console.log(LINE);

  const types = ['correct', 'conceptual', 'calculation', 'misconception'] as const;

  for (const t of types) {
    const a = withRag.options.find(o => o.type === t);
    const b = withoutRag.options.find(o => o.type === t);
    const color = TYPE_COLOR[t] ?? ((s: string) => s);

    console.log(color(BOLD(t)));
    console.log(`  WITH:    ${a?.text ?? '(missing)'}`);
    console.log(`  WITHOUT: ${b?.text ?? '(missing)'}`);
    console.log();
  }
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set. See usage comment at top of file.');
    process.exit(1);
  }

  console.log(BOLD('\nRAG COMPARISON TEST'));
  console.log(LINE);
  console.log(`Step:    ${BOLD(TEST_STEP.title)}`);
  console.log(`Type:    ${TEST_STEP.type}`);
  console.log(`Subject: ${TEST_STEP.subject}`);

  // Show retrieval result first so we know what the RAG run will be grounded in
  console.log(`\n${BOLD('Retrieval preview (top-1 match):')}`);
  const preview = await retrieveOne(TEST_STEP);
  if (preview) {
    console.log(`  doc id:   ${preview.doc.id}`);
    console.log(`  concept:  ${preview.doc.concept}`);
    console.log(`  score:    ${preview.score.toFixed(4)}`);
    console.log(`  seed:     "${preview.doc.distractorSeed}"`);
  } else {
    console.log('  (no match found)');
  }

  console.log(`\nRunning both generations in parallel...`);

  const [withRag, withoutRag] = await Promise.all([
    generateCrossQuestion(TEST_STEP),
    generateCrossQuestion(TEST_STEP, { skipRetrieval: true }),
  ]);

  printResult('WITH RETRIEVAL', withRag);
  printResult('WITHOUT RETRIEVAL', withoutRag);
  printDiff(withRag, withoutRag);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
