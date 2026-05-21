/**
 * Debug Logging System
 * 
 * Centralized logging for RAG pipeline operations.
 * Logs key events to nous_debug.log:
 * - RETRIEVAL: Retrieved documents with scores
 * - FALLBACK: Fallback scenarios when retrieval score is below threshold
 * - GEMINI: API latency metrics
 * - GEMINI_ERROR: Parsing errors from LLM response
 * - OUTPUT: Final generated question output
 * 
 * Usage: import { logger } from '@/lib/logger' and call logger.event()
 */

import fs from 'fs';
import path from 'path';

const LOG_PATH = path.join(process.cwd(), 'nous_debug.log');

function ts(): string {
  return new Date().toISOString();
}

function write(event: string, data: string): void {
  fs.appendFileSync(LOG_PATH, `[${ts()}] [${event}] ${data}\n`, 'utf8');
}

export const logger = {
  retrieval(docId: string, concept: string, score: number): void {
    write('RETRIEVAL', `docId=${docId} concept="${concept}" score=${score.toFixed(4)}`);
  },

  fallback(stepTitle: string, score: number, threshold: number): void {
    write('FALLBACK', `step="${stepTitle}" score=${score.toFixed(4)} threshold=${threshold} reason=below_threshold`);
  },

  geminiCall(latencyMs: number): void {
    write('GEMINI', `latency=${latencyMs}ms`);
  },

  geminiParseError(raw: string): void {
    write('GEMINI_ERROR', `rawResponse=${JSON.stringify(raw)}`);
  },

  output(result: object): void {
    write('OUTPUT', JSON.stringify(result));
  },

  clearLog(): void {
    fs.writeFileSync(LOG_PATH, '', 'utf8');
    console.log(`[logger] cleared ${LOG_PATH}`);
  },
};
