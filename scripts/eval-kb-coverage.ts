/**
 * Knowledge base coverage evaluation
 * Runs 10 representative steps through retrieveOne() and logs the score for
 * each. Use this to identify gaps in the knowledge base.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/eval-kb-coverage.ts
 */

import { retrieveOne } from '../lib/rag/retrieval';
import type { StepInput } from '../lib/rag/retrieval';

// ─── Test steps ───────────────────────────────────────────────────────────────
// Deliberately varied: different subjects, step types, concept areas.
// Includes one subject (history) with no KB coverage to surface a gap.

const TEST_STEPS: (StepInput & { label: string })[] = [
  {
    label: 'Calculus · identify indeterminate form',
    title: 'Identify the form',
    prompt: 'Substitute x = 2 into the expression and determine what type of form results. Explain what 0/0 signals about the next step.',
    type: 'Conceptual',
    subject: 'calculus',
  },
  {
    label: 'Calculus · factor cancellation',
    title: 'Factor and simplify',
    prompt: 'Factor x²−4 using difference of squares. Identify what cancels with the denominator and justify why cancellation is valid.',
    type: 'Procedural',
    subject: 'calculus',
  },
  {
    label: 'Calculus · evaluate after simplification',
    title: 'Evaluate the limit',
    prompt: 'Substitute x = 2 into the simplified expression and state the limit. Explain why direct substitution is now valid.',
    type: 'Calculation',
    subject: 'calculus',
  },
  {
    label: 'Calculus · apply chain rule',
    title: 'Differentiate composite function',
    prompt: 'Differentiate h(x) = sin(x³ − 2x) using the chain rule. Show the outer and inner function and apply d/dx[f(g(x))] = f\'(g(x))·g\'(x).',
    type: 'Procedural',
    subject: 'calculus',
  },
  {
    label: 'Calculus · add constant of integration',
    title: 'Write the antiderivative',
    prompt: 'Compute the indefinite integral of f(x) = 3x² and write the complete antiderivative including all required terms.',
    type: 'Procedural',
    subject: 'calculus',
  },
  {
    label: 'SQL · choose correct join type',
    title: 'Select the right JOIN',
    prompt: 'Write a query to list all patients including those without an assigned doctor. Identify which JOIN type returns unmatched rows from the left table.',
    type: 'Conceptual',
    subject: 'sql',
  },
  {
    label: 'SQL · filter aggregated groups',
    title: 'Filter with HAVING',
    prompt: 'Find doctors with more than 10 active patients. Explain why WHERE cannot be used here and which clause filters on aggregate results.',
    type: 'Procedural',
    subject: 'sql',
  },
  {
    label: 'CSS · equal-width flex items',
    title: 'Apply flex: 1 to box elements',
    prompt: 'Give each .box the CSS property that makes all three boxes share the container width equally. Explain what the value controls.',
    type: 'Conceptual',
    subject: 'css-flexbox',
  },
  {
    label: 'French · choose correct article',
    title: 'Fill in the article',
    prompt: 'Choose the correct definite or indefinite article for each blank. Account for noun gender and the contraction rule before vowels.',
    type: 'Procedural',
    subject: 'french-grammar',
  },
  {
    label: 'History · primary source analysis (no KB coverage)',
    title: 'Analyse the South Carolina Declaration',
    prompt: 'Identify the two strongest economic arguments in the South Carolina Declaration of Secession and explain what they reveal about Southern priorities.',
    type: 'Conceptual',
    subject: 'history',
  },
];

// ─── Thresholds ───────────────────────────────────────────────────────────────

const GOOD      = 0.75;
const ACCEPTABLE = 0.60;

// ─── Formatting ───────────────────────────────────────────────────────────────

const RESET  = '\x1b[0m';
const BOLD   = (s: string) => `\x1b[1m${s}${RESET}`;
const GREEN  = (s: string) => `\x1b[32m${s}${RESET}`;
const YELLOW = (s: string) => `\x1b[33m${s}${RESET}`;
const RED    = (s: string) => `\x1b[31m${s}${RESET}`;
const DIM    = (s: string) => `\x1b[2m${s}${RESET}`;
const LINE   = '─'.repeat(70);

function scoreLabel(score: number): string {
  if (score >= GOOD)       return GREEN(`${score.toFixed(4)}  ✓ good`);
  if (score >= ACCEPTABLE) return YELLOW(`${score.toFixed(4)}  ⚠ acceptable`);
  return RED(`${score.toFixed(4)}  ✗ gap`);
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    process.exit(1);
  }

  console.log(BOLD('\nKNOWLEDGE BASE COVERAGE EVALUATION'));
  console.log(LINE);
  console.log(DIM(`Thresholds:  good ≥ ${GOOD}   acceptable ≥ ${ACCEPTABLE}   gap < ${ACCEPTABLE}`));
  console.log(DIM('Running all steps in parallel...\n'));

  // Embed knowledge base + all 10 queries in parallel
  const results = await Promise.all(
    TEST_STEPS.map(async (step) => {
      const match = await retrieveOne(step);
      return { step, match };
    }),
  );

  // Print results
  for (const { step, match } of results) {
    console.log(BOLD(step.label));
    console.log(`  step type : ${step.type}`);

    if (match) {
      console.log(`  score     : ${scoreLabel(match.score)}`);
      console.log(`  top match : ${match.doc.id}`);
      console.log(DIM(`  concept   : ${match.doc.concept}`));
      console.log(DIM(`  seed      : "${match.doc.distractorSeed}"`));
    } else {
      console.log(`  score     : ${RED('no match returned')}`);
    }
    console.log();
  }

  // Summary stats
  const scores = results.map(r => r.match?.score ?? 0);
  const good       = scores.filter(s => s >= GOOD).length;
  const acceptable = scores.filter(s => s >= ACCEPTABLE && s < GOOD).length;
  const gaps       = scores.filter(s => s < ACCEPTABLE).length;
  const avg        = scores.reduce((a, b) => a + b, 0) / scores.length;
  const min        = Math.min(...scores);
  const max        = Math.max(...scores);

  console.log(LINE);
  console.log(BOLD('SUMMARY'));
  console.log(`  total steps : ${TEST_STEPS.length}`);
  console.log(`  ${GREEN(`good (≥${GOOD})`)}       : ${good}`);
  console.log(`  ${YELLOW(`acceptable (≥${ACCEPTABLE})`)} : ${acceptable}`);
  console.log(`  ${RED(`gaps (<${ACCEPTABLE})`)}      : ${gaps}`);
  console.log(`  avg score   : ${avg.toFixed(4)}`);
  console.log(`  range       : ${min.toFixed(4)} – ${max.toFixed(4)}`);

  if (gaps > 0) {
    console.log(`\n${BOLD('GAP SUBJECTS — add documents to knowledge base for:')}`);
    for (const { step, match } of results) {
      if (!match || match.score < ACCEPTABLE) {
        console.log(`  ${RED('✗')} ${step.subject}  (${step.label})`);
      }
    }
  }

  console.log();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
