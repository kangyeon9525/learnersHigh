import type { EndStudySessionRequest, StartStudySessionRequest } from '@learners-high/shared';
import { StudySessionModel } from '../db/models/index.js';
import { toStudySessionDto } from '../db/mappers.js';
import { settleStudySession } from './settlementService.js';

export async function startSession(body: StartStudySessionRequest) {
  const session = await StudySessionModel.create({
    userId: body.userId,
    startedAt: body.startedAt,
    focusMinutes: 0,
    completed: false,
    aiEvents: [],
  });
  return toStudySessionDto(session);
}

export async function endSession(body: EndStudySessionRequest & { sessionId: string }) {
  return settleStudySession(body, body.sessionId);
}

export async function appendAiEvent(
  sessionId: string,
  status: 'focus' | 'distracted',
) {
  const event = { at: new Date().toISOString(), status };
  const session = await StudySessionModel.findByIdAndUpdate(
    sessionId,
    { $push: { aiEvents: event } },
    { new: true },
  );
  if (!session) throw new Error('Session not found');
  return { session: toStudySessionDto(session), latestEvent: event };
}

export async function getActiveSession(userId: string) {
  const session = await StudySessionModel.findOne({ userId, completed: false }).sort({
    createdAt: -1,
  });
  return session ? toStudySessionDto(session) : null;
}
