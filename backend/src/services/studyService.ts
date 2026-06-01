import mongoose from 'mongoose';
import type { EndStudySessionRequest, StartStudySessionRequest } from '@learners-high/shared';
import { StudySessionModel } from '../db/models/index.js';
import { toStudySessionDto } from '../db/mappers.js';
import { settleStudySession } from './settlementService.js';
import * as focusMonitorService from './focusMonitorService.js';

/** 미완료 세션 일괄 종료 — 유령 세션·중복 시작 방지 */
export async function abandonIncompleteSessions(userId: string) {
  if (!mongoose.isValidObjectId(userId)) return;
  const endedAt = new Date().toISOString();
  await StudySessionModel.updateMany(
    { userId, completed: false },
    { $set: { completed: true, endedAt, focusMinutes: 0 } },
  );
}

export async function startSession(body: StartStudySessionRequest) {
  await abandonIncompleteSessions(body.userId);
  const session = await StudySessionModel.create({
    userId: body.userId,
    startedAt: body.startedAt,
    focusMinutes: 0,
    completed: false,
    aiEvents: [],
  });
  await focusMonitorService.onStudySessionStarted(body.userId, session._id.toString());
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
  await focusMonitorService.syncFromAiStatus(session.userId.toString(), status);
  return { session: toStudySessionDto(session), latestEvent: event };
}

export async function getActiveSession(userId: string) {
  if (!mongoose.isValidObjectId(userId)) return null;
  const session = await StudySessionModel.findOne({ userId, completed: false }).sort({
    createdAt: -1,
  });
  if (!session) return null;

  const staleMs = 30 * 60 * 1000;
  const started = new Date(session.startedAt).getTime();
  if (!Number.isNaN(started) && Date.now() - started > staleMs) {
    session.completed = true;
    session.endedAt = new Date().toISOString();
    session.focusMinutes = session.focusMinutes ?? 0;
    await session.save();
    return null;
  }

  return toStudySessionDto(session);
}
