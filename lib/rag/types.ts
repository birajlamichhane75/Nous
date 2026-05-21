/**
 * Type Definitions: RAG System Data Structures
 * 
 * Core TypeScript interfaces and types for the Nous RAG pipeline:
 * - MisconceptionDoc: Knowledge base document representing a student error pattern
 * - ScoredDoc: Retrieved document with retrieval similarity score
 * - RetrievedContext: Retrieval results returned to generation module
 * 
 * Supports categorization of errors and steps for targeted diagnostics.
 */

export type StepType = 'Conceptual' | 'Procedural' | 'Calculation';

// Mirrors the ErrorType in the workspace — 'misconception' maps to the 4th diagnostic bucket
export type ErrorCategory = 'conceptual' | 'procedural' | 'calculation' | 'misconception';

export interface MisconceptionDoc {
  id: string;
  concept: string;         // e.g. "indeterminate forms", "factor cancellation"
  subject: string;         // e.g. "calculus", "sql", "css-flexbox", "french-grammar"
  stepType: StepType;      // which step type this error commonly appears in
  errorCategory: ErrorCategory;
  studentBehavior: string; // what the student wrongly believes or does
  correctReasoning: string;
  distractorSeed: string;  // concise wrong-answer text — seeds Gemini's wrong-option generation
  teachingNote: string;    // why the error happens; grounds the hint explanation
  tags: string[];          // keywords for embedding / BM25 pre-filter
}

export interface ScoredDoc {
  doc: MisconceptionDoc;
  score: number;
}

// The payload returned to the Gemini prompt
export interface RetrievedContext {
  topDocs: ScoredDoc[];
  queryText: string;
}
