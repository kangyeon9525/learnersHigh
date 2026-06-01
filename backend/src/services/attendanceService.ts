import mongoose from 'mongoose';
import type { AttendanceRecord, CheckInRequest, CheckOutRequest, CheckInResponse } from '@learners-high/shared';
import { AttendanceModel } from '../db/models/index.js';
import { toAttendanceDto } from '../db/mappers.js';
import * as focusMonitorService from './focusMonitorService.js';

export async function checkIn(body: CheckInRequest): Promise<CheckInResponse> {
  const active = await AttendanceModel.findOne({
    userId: body.userId,
    status: 'checked_in',
  });
  if (active) {
    if (!active.focusMonitoring?.enabled) {
      await focusMonitorService.startMonitoring(body.userId, active._id.toString());
    }
    return {
      attendance: focusMonitorService.toAttendanceWithMonitoring(active),
      focusMonitor: await focusMonitorService.getMonitorState(body.userId),
    };
  }

  const checkInAt = body.checkInAt ?? new Date().toISOString();
  const doc = await AttendanceModel.create({
    userId: body.userId,
    checkInAt,
    status: 'checked_in',
  });
  const focusMonitor = await focusMonitorService.startMonitoring(
    body.userId,
    doc._id.toString(),
  );
  return {
    attendance: focusMonitorService.toAttendanceWithMonitoring(doc),
    focusMonitor,
  };
}

export async function checkOut(body: CheckOutRequest): Promise<{
  record: AttendanceRecord;
  reportSent: boolean;
}> {
  const active = await AttendanceModel.findOne({
    userId: body.userId,
    status: 'checked_in',
  });
  if (!active) {
    throw Object.assign(new Error('No active check-in'), { statusCode: 400 });
  }

  const checkOutAt = body.checkOutAt ?? new Date().toISOString();
  active.checkOutAt = checkOutAt;
  active.status = 'checked_out';
  active.purpose = body.purpose;
  if (active.focusMonitoring) {
    active.focusMonitoring.enabled = false;
  }
  await active.save();
  await focusMonitorService.stopMonitoring(body.userId);

  const reportSent = body.purpose === 'home';
  if (reportSent) {
    console.info(`[attendance] Mock daily report sent for user ${body.userId}`);
  }

  return { record: toAttendanceDto(active), reportSent };
}

export async function getActiveAttendance(userId: string): Promise<AttendanceRecord | null> {
  if (!mongoose.isValidObjectId(userId)) return null;
  const doc = await AttendanceModel.findOne({ userId, status: 'checked_in' }).sort({
    checkInAt: -1,
  });
  return doc ? focusMonitorService.toAttendanceWithMonitoring(doc) : null;
}
