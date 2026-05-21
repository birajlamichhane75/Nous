import { NextRequest, NextResponse } from 'next/server';
import { generateCrossQuestion } from '@/lib/rag/generate';
import type { StepInput } from '@/lib/rag/retrieval';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { step: StepInput };
    const { step } = body;

    if (!step?.title || !step?.type) {
      return NextResponse.json(
        { error: 'step.title and step.type are required' },
        { status: 400 },
      );
    }

    const result = await generateCrossQuestion(step);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[cross-question]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
