import mongoose from 'mongoose';
import type {
  AiFocusStatus,
  AttendanceRecord,
  FocusMonitorDisplayMode,
  FocusMonitorState,
} from '@learners-high/shared';
import { AttendanceModel, StudySessionModel } from '../db/models/index.js';
import { toAttendanceDto } from '../db/mappers.js';
import { getFrameById, pickFrameForStatus } from '../config/focusMonitorCatalog.js';

function resolveDisplayMode(hasActiveSession: boolean): FocusMonitorDisplayMode {
  return hasActiveSession ? 'live' : 'standby';
}

function standbyFrame() {
  return pickFrameForStatus('focus', 0);
}

function inactiveState(): FocusMonitorState {
  return {
    active: false,
    displayMode: 'standby',
    status: 'focus',
    frame: standbyFrame(),
    isRecording: false,
  };
}

function buildState(
  attendanceId: string,
  status: AiFocusStatus,
  frameId: string,
  startedAt: string,
  displayMode: FocusMonitorDisplayMode,
  sessionId?: string,
): FocusMonitorState {
  const frame = getFrameById(frameId) ?? pickFrameForStatus(status);
  return {
    active: true,
    displayMode,
    status,
    frame,
    monitoringSince: startedAt,
    isRecording: false,
    attendanceId,
    sessionId,
  };
}

async function findActiveSession(userId: string) {
  return StudySessionModel.findOne({ userId, completed: false }).sort({ createdAt: -1 });
}

/** 입실 시 집중 모니터링 메타 시작 (화면은 학습 시작 전까지 standby) */
export async function startMonitoring(userId: string, attendanceId: string): Promise<FocusMonitorState> {
  const startedAt = new Date().toISOString();
  const frame = standbyFrame();

  await AttendanceModel.findByIdAndUpdate(attendanceId, {
    focusMonitoring: {
      enabled: true,
      currentStatus: 'focus',
      currentFrameId: frame.id,
      startedAt,
    },
  });

  const session = await findActiveSession(userId);
  const displayMode = resolveDisplayMode(!!session);

  return buildState(
    attendanceId,
    'focus',
    frame.id,
    startedAt,
    displayMode,
    session?._id.toString(),
  );
}

/** 학습 세션 시작 시 mock-AI 집중 프레임 선택 */
export async function onStudySessionStarted(userId: string, sessionId: string): Promise<FocusMonitorState | null> {
  const attendance = await AttendanceModel.findOne({ userId, status: 'checked_in' });
  if (!attendance) return null;

  const frame = pickFrameForStatus('focus', Date.now() % 4);
  const startedAt = attendance.focusMonitoring?.startedAt ?? new Date().toISOString();

  if (!attendance.focusMonitoring?.enabled) {
    attendance.focusMonitoring = {
      enabled: true,
      currentStatus: 'focus',
      currentFrameId: frame.id,
      startedAt,
    };
  } else {
    attendance.focusMonitoring.currentStatus = 'focus';
    attendance.focusMonitoring.currentFrameId = frame.id;
  }
  await attendance.save();

  return buildState(attendance._id.toString(), 'focus', frame.id, startedAt, 'live', sessionId);
}

/** mock-ai / 세션 이벤트와 동기화 */
export async function syncFromAiStatus(
  userId: string,
  status: AiFocusStatus,
): Promise<FocusMonitorState | null> {
  const attendance = await AttendanceModel.findOne({ userId, status: 'checked_in' });
  if (!attendance?.focusMonitoring?.enabled) return null;

  const frame = pickFrameForStatus(status, Date.now() % 4);
  attendance.focusMonitoring.currentStatus = status;
  attendance.focusMonitoring.currentFrameId = frame.id;
  await attendance.save();

  const session = await findActiveSession(userId);
  const startedAt = attendance.focusMonitoring.startedAt ?? new Date().toISOString();
  const displayMode = session ? 'live' : 'standby';

  return buildState(
    attendance._id.toString(),
    status,
    frame.id,
    startedAt,
    displayMode,
    session?._id.toString(),
  );
}

export async function stopMonitoring(userId: string): Promise<void> {
  await AttendanceModel.updateMany(
    { userId, status: 'checked_in' },
    { $set: { 'focusMonitoring.enabled': false } },
  );
}

export async function getMonitorState(userId: string): Promise<FocusMonitorState> {
  if (!mongoose.isValidObjectId(userId)) return inactiveState();
  const attendance = await AttendanceModel.findOne({ userId, status: 'checked_in' }).sort({
    checkInAt: -1,
  });

  if (!attendance?.focusMonitoring?.enabled) {
    return inactiveState();
  }

  const fm = attendance.focusMonitoring;
  const session = await findActiveSession(userId);
  const displayMode = resolveDisplayMode(!!session);

  let status = (fm.currentStatus ?? 'focus') as AiFocusStatus;
  if (session?.aiEvents?.length) {
    const latest = session.aiEvents[session.aiEvents.length - 1];
    status = latest.status as AiFocusStatus;
    if (status !== fm.currentStatus) {
      const frame = pickFrameForStatus(status, session.aiEvents.length);
      attendance.focusMonitoring.currentStatus = status;
      attendance.focusMonitoring.currentFrameId = frame.id;
      await attendance.save();
      const startedAt = fm.startedAt ?? new Date().toISOString();
      return buildState(
        attendance._id.toString(),
        status,
        frame.id,
        startedAt,
        displayMode,
        session._id.toString(),
      );
    }
  }

  const startedAt = fm.startedAt ?? new Date().toISOString();
  const frameId = fm.currentFrameId ?? pickFrameForStatus(status).id;
  return buildState(
    attendance._id.toString(),
    status,
    frameId,
    startedAt,
    displayMode,
    session?._id.toString(),
  );
}

export function toAttendanceWithMonitoring(
  doc: Parameters<typeof toAttendanceDto>[0],
): AttendanceRecord {
  const base = toAttendanceDto(doc);
  const fm = doc.focusMonitoring;
  if (!fm?.enabled || !fm.currentFrameId || !fm.startedAt) return base;
  return {
    ...base,
    focusMonitoring: {
      enabled: true,
      currentStatus: (fm.currentStatus ?? 'focus') as AiFocusStatus,
      currentFrameId: fm.currentFrameId,
      startedAt: fm.startedAt,
    },
  };
}
