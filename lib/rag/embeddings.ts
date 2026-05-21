import { GoogleGenAI } from '@google/genai';

const MODEL = 'text-embedding-004';

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}
// Rag (Retrieval-Augmented Generation) functionality implementation
// This file contains functions for generating embeddings using the Gemini API
// for use in a retrieval-augmented generation system.
// taskType controls how Gemini optimizes the embedding:
//   RETRIEVAL_DOCUMENT — use when embedding knowledge-base documents
//   RETRIEVAL_QUERY    — use when embedding the incoming step query
export async function embedText(
  text: string,
  taskType: 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY' = 'RETRIEVAL_QUERY',
): Promise<number[]> {
  const ai = getClient();
  const response = await ai.models.embedContent({
    model: MODEL,
    contents: text,
    config: { taskType },
  });
  const values = response.embeddings?.[0]?.values;
  if (!values) throw new Error('Gemini embedContent returned no embedding values');
  return values;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// Builds the text that gets embedded for a knowledge-base document.
// Combines concept-level info + the student behavior + tags for broad coverage.
export function docToEmbeddingText(doc: {
  concept: string;
  subject: string;
  stepType: string;
  studentBehavior: string;
  correctReasoning: string;
  tags: string[];
}): string {
  return [
    `Concept: ${doc.concept}`,
    `Subject: ${doc.subject}`,
    `Step type: ${doc.stepType}`,
    `Student error: ${doc.studentBehavior}`,
    `Correct reasoning: ${doc.correctReasoning}`,
    `Keywords: ${doc.tags.join(', ')}`,
  ].join('\n');
}
