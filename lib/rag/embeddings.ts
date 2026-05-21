/**
 * Embedding & Similarity Module
 * 
 * Handles vector embeddings for the RAG system using Google's Gemini
 * embedding model. Provides functions to:
 * - Generate embeddings for documents and queries
 * - Calculate cosine similarity between vectors
 * - Convert misconception documents to embedding-ready text
 * 
 * Task Types:
 * - RETRIEVAL_DOCUMENT: Optimizes embeddings for knowledge-base indexing
 * - RETRIEVAL_QUERY: Optimizes embeddings for incoming step queries
 */

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
// The embeddings are used to find the most relevant documents or queries for a given input.

// taskType controls how Gemini optimizes the embedding:
//   RETRIEVAL_DOCUMENT — use when embedding knowledge-base documents
//   RETRIEVAL_QUERY    — use when embedding the incoming step query
/**
 * Generates a vector embedding for the given text using Gemini's embedding model
 * 
 * @param text - Input text to embed (document or query)
 * @param taskType - Optimization hint for Gemini (RETRIEVAL_DOCUMENT or RETRIEVAL_QUERY)
 * @returns 768-dimensional embedding vector ready for similarity search
 * @throws Error if API key is missing or embedding generation fails
 * 
 * Note: Results are deterministic and cached in the retrieval index for performance.
 * For large-scale use, consider persisting embeddings to a vector database (e.g., Pinecone).
 */
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

/**
 * Calculates cosine similarity between two embedding vectors
 * 
 * @param a - First embedding vector
 * @param b - Second embedding vector
 * @returns Similarity score in range [0, 1] where 1 = identical direction
 * 
 * Used for ranking retrieval results. Higher scores indicate more semantically similar content.
 */
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

/**
 * Converts a misconception document into embedding-ready text
 * 
 * Combines structured document fields into a single text representation
 * that captures: concept, subject, error type, student behavior, correct reasoning,
 * and tags for comprehensive semantic search coverage.
 * 
 * @param doc - Misconception document
 * @returns Formatted multi-line text optimized for embedding
 */
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
