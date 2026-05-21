/**
 * Knowledge Base: Misconceptions Catalog
 * 
 * Centralized repository of research-backed student misconceptions
 * organized by subject and concept. Each document contains:
 * - Conceptual context and error categories
 * - Real student behaviors and common patterns
 * - Correct reasoning explanations
 * - Distractor seeds for question generation
 * - Teaching notes and remediation guidance
 * 
 * Used by RAG retrieval to seed LLM-generated diagnostic questions.
 * Supports calculus, SQL, CSS, French grammar, and more.
 */

import type { MisconceptionDoc } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// CALCULUS — Limits
// ─────────────────────────────────────────────────────────────────────────────

const CALCULUS_LIMITS: MisconceptionDoc[] = [
  {
    id: 'calc-limit-001',
    concept: 'indeterminate forms',
    subject: 'calculus',
    stepType: 'Conceptual',
    errorCategory: 'misconception',
    studentBehavior:
      'Student sees 0/0 from direct substitution and concludes the limit does not exist.',
    correctReasoning:
      '0/0 is an indeterminate form — it means direct substitution failed and a different technique (factoring, L\'Hôpital, conjugate) is needed. The limit may still exist.',
    distractorSeed: 'The limit does not exist because substitution gives 0/0',
    teachingNote:
      'Students conflate "undefined at a point" with "limit does not exist". A removable discontinuity (hole) still has a well-defined limit.',
    tags: ['limit', 'indeterminate', '0/0', 'direct substitution', 'removable discontinuity', 'calculus'],
  },
  {
    id: 'calc-limit-002',
    concept: 'factor cancellation validity',
    subject: 'calculus',
    stepType: 'Procedural',
    errorCategory: 'conceptual',
    studentBehavior:
      'Student cancels (x−2) from numerator and denominator without justifying why it is legal, treating it as a pure algebraic simplification.',
    correctReasoning:
      'Cancellation is valid because x→2 means x≠2, so (x−2)≠0. The limit context — not just appearance — is what makes cancellation legal.',
    distractorSeed: 'Because the same factor appears in both numerator and denominator',
    teachingNote:
      'Students apply fraction rules mechanically without understanding that cancelling a factor that could equal zero changes the domain. The limit context provides the non-zero guarantee.',
    tags: ['cancellation', 'factor', 'limit', 'non-zero', 'algebra', 'calculus'],
  },
  {
    id: 'calc-limit-003',
    concept: 'arithmetic substitution in limit evaluation',
    subject: 'calculus',
    stepType: 'Calculation',
    errorCategory: 'calculation',
    studentBehavior:
      'Student substitutes x=2 into x²−4 but computes 4−4=0 correctly then writes the denominator as 4 instead of 0, getting 0/4=0.',
    correctReasoning:
      'Denominator is x−2; at x=2 this equals 0. Both numerator (x²−4=0) and denominator (x−2=0) give 0, producing the 0/0 indeterminate form.',
    distractorSeed: 'The denominator at x=2 is 4, so the expression equals 0/4 = 0',
    teachingNote:
      'Students confuse the denominator "x−2" with the full expression "x²−4". Careful step-by-step substitution of numerator and denominator separately prevents this.',
    tags: ['substitution', 'arithmetic', 'denominator', 'numerator', 'evaluation', 'calculus'],
  },
  {
    id: 'calc-limit-004',
    concept: 'why substitution works after simplification',
    subject: 'calculus',
    stepType: 'Calculation',
    errorCategory: 'conceptual',
    studentBehavior:
      'Student believes the simplified form (x+2) is identical to the original function everywhere, including at x=2, so f(2) now equals 4.',
    correctReasoning:
      'The simplified form equals the original for all x≠2, making the limits equal. But f(2) is still undefined in the original — the limit is 4, not the function value.',
    distractorSeed: 'The simplified expression equals the original function everywhere, including at x=2',
    teachingNote:
      'Conflating limit with function value is one of the central conceptual errors in introductory calculus. The simplified form restores substitutability for limits, not for the original function.',
    tags: ['simplification', 'function value', 'limit', 'substitution', 'hole', 'calculus'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CALCULUS — Derivatives
// ─────────────────────────────────────────────────────────────────────────────

const CALCULUS_DERIVATIVES: MisconceptionDoc[] = [
  {
    id: 'calc-deriv-001',
    concept: 'chain rule outer derivative',
    subject: 'calculus',
    stepType: 'Procedural',
    errorCategory: 'procedural',
    studentBehavior:
      'Student differentiates the inner function correctly but forgets to multiply by the derivative of the outer function.',
    correctReasoning:
      'd/dx[f(g(x))] = f\'(g(x)) · g\'(x). Both the outer derivative evaluated at the inner function AND the inner derivative are required.',
    distractorSeed: 'Differentiate the inner function only; the outer function contributes no extra factor',
    teachingNote:
      'Students often see the chain rule as "differentiate what\'s inside" without realizing the outer function must also be differentiated and evaluated at the inner function.',
    tags: ['chain rule', 'composite function', 'outer derivative', 'inner function', 'differentiation', 'calculus'],
  },
  {
    id: 'calc-deriv-002',
    concept: 'derivative of e^x vs e^(u(x))',
    subject: 'calculus',
    stepType: 'Conceptual',
    errorCategory: 'conceptual',
    studentBehavior:
      'Student applies d/dx[e^x] = e^x to e^(cos x) without applying the chain rule, writing the derivative as just e^(cos x).',
    correctReasoning:
      'd/dx[e^(cos x)] = e^(cos x) · (−sin x). The chain rule multiplies by the derivative of the exponent.',
    distractorSeed: 'The derivative of e^(cos x) is e^(cos x) because d/dx[e^x] = e^x',
    teachingNote:
      'Students over-generalize the special property of e^x to composite exponentials. The rule d/dx[e^x]=e^x only applies when the exponent is exactly x, not a function of x.',
    tags: ['exponential', 'e^x', 'chain rule', 'composite', 'derivative', 'calculus'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CALCULUS — Integration
// ─────────────────────────────────────────────────────────────────────────────

const CALCULUS_INTEGRATION: MisconceptionDoc[] = [
  {
    id: 'calc-integ-001',
    concept: 'constant of integration',
    subject: 'calculus',
    stepType: 'Procedural',
    errorCategory: 'procedural',
    studentBehavior:
      'Student computes the antiderivative correctly but omits +C in an indefinite integral.',
    correctReasoning:
      'Every indefinite integral requires +C because any constant differentiates to zero — there is a family of antiderivatives, not one.',
    distractorSeed: 'The constant +C is only needed when the problem explicitly asks for it',
    teachingNote:
      'Students treat +C as a formality rather than a mathematical necessity. Reminding them that differentiation of any constant = 0 grounds the requirement concretely.',
    tags: ['integration', 'antiderivative', 'constant of integration', '+C', 'indefinite', 'calculus'],
  },
  {
    id: 'calc-integ-002',
    concept: 'order of integration limits',
    subject: 'calculus',
    stepType: 'Calculation',
    errorCategory: 'calculation',
    studentBehavior:
      'Student evaluates F(a) − F(b) instead of F(b) − F(a) when applying the Fundamental Theorem of Calculus.',
    correctReasoning:
      '∫_a^b f(x)dx = F(b) − F(a). The upper limit is evaluated first, lower limit second. Reversing gives the negative of the correct answer.',
    distractorSeed: 'Evaluate F(lower bound) minus F(upper bound)',
    teachingNote:
      'A sign error that flips the result. Students sometimes apply the subtraction in "lower from upper" intuition which is backwards.',
    tags: ['definite integral', 'FTC', 'fundamental theorem', 'bounds', 'evaluation', 'calculus'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DATABASES — SQL
// ─────────────────────────────────────────────────────────────────────────────

const SQL_JOINS: MisconceptionDoc[] = [
  {
    id: 'sql-join-001',
    concept: 'INNER JOIN vs LEFT JOIN',
    subject: 'sql',
    stepType: 'Conceptual',
    errorCategory: 'conceptual',
    studentBehavior:
      'Student believes INNER JOIN returns all rows from both tables and that LEFT JOIN only returns rows from the left table.',
    correctReasoning:
      'INNER JOIN returns rows where the join condition is met in BOTH tables. LEFT JOIN returns all rows from the left table plus matched rows from the right (NULL for non-matches).',
    distractorSeed: 'INNER JOIN returns all rows from both tables regardless of match',
    teachingNote:
      'Students confuse join types with UNION or CROSS JOIN. The filtering behavior of INNER JOIN — dropping non-matching rows — is the key distinction to reinforce.',
    tags: ['SQL', 'INNER JOIN', 'LEFT JOIN', 'join', 'NULL', 'relational', 'database'],
  },
  {
    id: 'sql-join-002',
    concept: 'WHERE vs HAVING clause placement',
    subject: 'sql',
    stepType: 'Procedural',
    errorCategory: 'procedural',
    studentBehavior:
      'Student uses WHERE to filter on an aggregate function result (e.g., WHERE COUNT(*) > 10) instead of HAVING.',
    correctReasoning:
      'WHERE filters individual rows before grouping. HAVING filters groups after aggregation. Aggregates like COUNT, SUM, AVG cannot appear in WHERE.',
    distractorSeed: 'Use WHERE COUNT(*) > 10 to filter groups with more than 10 records',
    teachingNote:
      'Students apply WHERE universally without understanding query execution order. Showing the logical sequence (FROM → WHERE → GROUP BY → HAVING → SELECT) fixes this.',
    tags: ['SQL', 'WHERE', 'HAVING', 'aggregate', 'GROUP BY', 'filter', 'database'],
  },
  {
    id: 'sql-join-003',
    concept: 'COUNT with NULL values',
    subject: 'sql',
    stepType: 'Calculation',
    errorCategory: 'calculation',
    studentBehavior:
      'Student uses COUNT(*) expecting it to count non-NULL values in a specific column, getting a higher number than intended.',
    correctReasoning:
      'COUNT(*) counts all rows including NULLs. COUNT(column_name) counts only non-NULL values in that column. Use COUNT(column) when NULLs should be excluded.',
    distractorSeed: 'COUNT(*) automatically skips NULL values in any column',
    teachingNote:
      'NULL handling is consistently misunderstood in SQL. COUNT(*) vs COUNT(col) is a classic source of off-by-one errors in queries.',
    tags: ['SQL', 'COUNT', 'NULL', 'aggregate', 'rows', 'database'],
  },
];

const SQL_NORMALIZATION: MisconceptionDoc[] = [
  {
    id: 'sql-norm-001',
    concept: '2NF vs eliminating duplicates',
    subject: 'sql',
    stepType: 'Conceptual',
    errorCategory: 'misconception',
    studentBehavior:
      'Student believes 2NF simply means removing duplicate data from a table, rather than eliminating partial functional dependencies.',
    correctReasoning:
      '2NF requires that every non-key attribute be fully functionally dependent on the entire primary key — not just part of it. It applies only when the primary key is composite.',
    distractorSeed: '2NF means removing all duplicate values from every column in the table',
    teachingNote:
      'Normalization is frequently confused with deduplication. 2NF is specifically about partial dependencies on composite keys, not about repeated values.',
    tags: ['normalization', '2NF', 'functional dependency', 'composite key', 'partial dependency', 'database'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WEB PROGRAMMING — CSS Flexbox
// ─────────────────────────────────────────────────────────────────────────────

const CSS_FLEXBOX: MisconceptionDoc[] = [
  {
    id: 'css-flex-001',
    concept: 'flex:1 and proportional sizing',
    subject: 'css-flexbox',
    stepType: 'Conceptual',
    errorCategory: 'conceptual',
    studentBehavior:
      'Student believes flex:1 sets the element to 100% width of its container.',
    correctReasoning:
      'flex:1 is shorthand for flex-grow:1. It distributes available space proportionally among siblings. All siblings with flex:1 get equal shares — not 100% each.',
    distractorSeed: 'flex: 1 sets the element width to 100% of the parent container',
    teachingNote:
      'Students map flex values to percentage widths. The proportional growth model is the correct mental model: flex-grow controls the ratio of leftover space distribution.',
    tags: ['flexbox', 'flex', 'flex-grow', 'width', 'proportional', 'CSS', 'layout'],
  },
  {
    id: 'css-flex-002',
    concept: 'flex:2 vs flex:1 relative sizing',
    subject: 'css-flexbox',
    stepType: 'Conceptual',
    errorCategory: 'misconception',
    studentBehavior:
      'Student believes flex:2 always makes an element exactly twice the absolute width of a flex:1 sibling.',
    correctReasoning:
      'flex:2 gives the element twice the share of the available remaining space — not twice the total width. The starting basis (flex-basis) affects the actual rendered width.',
    distractorSeed: 'flex: 2 makes this element exactly twice as wide as a flex: 1 sibling in all cases',
    teachingNote:
      'The doubled-share model only holds when flex-basis is 0 for all siblings. With default auto basis, the calculation includes intrinsic sizes which distorts the ratio.',
    tags: ['flexbox', 'flex-grow', 'flex ratio', 'sizing', 'flex-basis', 'CSS'],
  },
  {
    id: 'css-flex-003',
    concept: 'media query scope',
    subject: 'css-flexbox',
    stepType: 'Procedural',
    errorCategory: 'misconception',
    studentBehavior:
      'Student writes a media query and expects the styles inside it to override all earlier declarations at any screen size, not just the target range.',
    correctReasoning:
      'Media query styles apply only when the condition is true. Outside that range, earlier cascade rules apply. Mobile-first means default styles target small screens; wider breakpoints add overrides.',
    distractorSeed: 'Styles inside a media query override all earlier declarations regardless of screen size',
    teachingNote:
      'Students misread media queries as "mode switches" rather than conditional layers in the cascade. Mobile-first ordering (default → larger breakpoints) resolves most specificity confusion.',
    tags: ['media query', 'responsive', 'breakpoint', 'CSS', 'cascade', 'mobile-first'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// WEB PROGRAMMING — JavaScript
// ─────────────────────────────────────────────────────────────────────────────

const JS_FUNDAMENTALS: MisconceptionDoc[] = [
  {
    id: 'js-001',
    concept: 'var vs let hoisting',
    subject: 'javascript',
    stepType: 'Conceptual',
    errorCategory: 'conceptual',
    studentBehavior:
      'Student treats let and var as interchangeable, not realizing var is function-scoped and hoisted while let is block-scoped and not accessible before declaration.',
    correctReasoning:
      'var declarations are hoisted to the function scope and initialized as undefined. let is block-scoped and in a temporal dead zone before declaration — accessing it throws a ReferenceError.',
    distractorSeed: 'let and var behave identically; the difference is only stylistic preference',
    teachingNote:
      'Hoisting is frequently taught as a curiosity rather than a practical concern. Real bugs from var in loops (closure-over-index) make the distinction concrete.',
    tags: ['JavaScript', 'var', 'let', 'hoisting', 'scope', 'block scope', 'temporal dead zone'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FRENCH — Grammar
// ─────────────────────────────────────────────────────────────────────────────

const FRENCH_GRAMMAR: MisconceptionDoc[] = [
  {
    id: 'fr-001',
    concept: 'definite vs indefinite articles',
    subject: 'french-grammar',
    stepType: 'Conceptual',
    errorCategory: 'conceptual',
    studentBehavior:
      'Student maps French articles directly to English "the/a/some", not accounting for gender agreement or the contraction rules for l\'.',
    correctReasoning:
      'French articles agree in gender and number: le (masc.), la (fem.), l\' (before vowel/h), les (plural) for definite; un (masc.), une (fem.), des (plural) for indefinite.',
    distractorSeed: 'French articles work exactly like English the/a — le always = the, un always = a',
    teachingNote:
      'Direct translation mapping breaks immediately on gender agreement and the l\' contraction. Students need to learn the gender of each noun as a paired unit.',
    tags: ['French', 'articles', 'gender', 'le', 'la', 'un', 'une', 'agreement', 'grammar'],
  },
  {
    id: 'fr-002',
    concept: '-er verb conjugation endings',
    subject: 'french-grammar',
    stepType: 'Procedural',
    errorCategory: 'procedural',
    studentBehavior:
      'Student applies the same ending across all persons (e.g., using -e for nous/vous forms) or confuses the nous (-ons) and vous (-ez) endings.',
    correctReasoning:
      '-er verbs: je (-e), tu (-es), il/elle (-e), nous (-ons), vous (-ez), ils/elles (-ent). The nous and vous forms are commonly confused.',
    distractorSeed: 'The nous form of parler is "parle" because all present tense -er verbs end in -e',
    teachingNote:
      'Rote memorization of endings often breaks down at nous/vous because students over-apply the dominant -e/-es/-e pattern to all persons.',
    tags: ['French', 'conjugation', '-er verbs', 'present tense', 'nous', 'vous', 'endings', 'grammar'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Exported corpus
// ─────────────────────────────────────────────────────────────────────────────

export const KNOWLEDGE_BASE: MisconceptionDoc[] = [
  ...CALCULUS_LIMITS,
  ...CALCULUS_DERIVATIVES,
  ...CALCULUS_INTEGRATION,
  ...SQL_JOINS,
  ...SQL_NORMALIZATION,
  ...CSS_FLEXBOX,
  ...JS_FUNDAMENTALS,
  ...FRENCH_GRAMMAR,
];
