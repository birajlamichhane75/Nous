/**
 * API Route: Cross-Question Generation
 * 
 * POST /api/cross-question
 * 
 * Generates a diagnostic cross-question for a given step in a course.
 * Integrates the RAG pipeline to retrieve relevant misconceptions
 * and uses Gemini to generate contextually appropriate MCQs.
 * 
 * Request Body:
 *   { step: { title: string, prompt: string, type: string, subject?: string } }
 * 
 * Response:
 *   { question: string, options: MCQOption[], retrievedDocId?: string, retrievalScore?: number }
 * 
 * Errors: Returns 400 for missing fields, 500 for processing errors
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCrossQuestion } from '@/lib/rag/generate';
import type { StepInput } from '@/lib/rag/retrieval';

/**
 * POST handler for cross-question generation
 * Validates input, invokes RAG pipeline, and returns generated question
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = (await req.json()) as { step: StepInput };
    const { step } = body;

    // Required fields validation
    if (!step?.title || !step?.type) {
      return NextResponse.json(
        { error: 'step.title and step.type are required' },
        { status: 400 },
      );
    }

    // Invoke RAG generation pipeline
    const result = await generateCrossQuestion(step);
    return NextResponse.json(result);
  } catch (err) {
    // Comprehensive error handling with detailed error messages
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[cross-question] API error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
