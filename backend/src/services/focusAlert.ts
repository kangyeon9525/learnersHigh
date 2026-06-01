import type { AiEvent } from '@learners-high/shared';
import { DISTRACTED_STREAK_THRESHOLD } from '../config/focusAlert.js';

/** aiEvents 끝에서부터 연속 distracted 개수 */
export function countTrailingDistracted(events: AiEvent[]): number {
  let count = 0;
  for (let i = events.length - 1; i >= 0; i -= 1) {
    if (events[i].status !== 'distracted') break;
    count += 1;
  }
  return count;
}

export function shouldTriggerFocusAlert(events: AiEvent[]): boolean {
  return countTrailingDistracted(events) >= DISTRACTED_STREAK_THRESHOLD;
}
