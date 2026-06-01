import type { AttendanceRecord, CheckInRequest, CheckOutRequest } from '@learners-high/shared';
import { AttendanceModel } from '../db/models/index.js';
import { toAttendanceDto } from '../db/mappers.js';

export async function checkIn(body: CheckInRequest): Promise<AttendanceRecord> {
  const active = await AttendanceModel.findOne({
    userId: body.userId,
    status: 'checked_in',
  });
  if (active) {
    throw Object.assign(new Error('Already checked in'), { statusCode: 409 });
  }

  const checkInAt = body.checkInAt ?? new Date().toISOString();
  const doc = await AttendanceModel.create({
    userId: body.userId,
    checkInAt,
    status: 'checked_in',
  });
  return toAttendanceDto(doc);
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
  await active.save();

  const reportSent = body.purpose === 'home';
  if (reportSent) {
    console.info(`[attendance] Mock daily report sent for user ${body.userId}`);
  }

  return { record: toAttendanceDto(active), reportSent };
}

export async function getActiveAttendance(userId: string): Promise<AttendanceRecord | null> {
  const doc = await AttendanceModel.findOne({ userId, status: 'checked_in' }).sort({
    checkInAt: -1,
  });
  return doc ? toAttendanceDto(doc) : null;
}
