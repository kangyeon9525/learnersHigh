import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const attendanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    checkInAt: { type: String, required: true },
    checkOutAt: { type: String },
    status: { type: String, enum: ['checked_in', 'checked_out'], required: true },
    purpose: { type: String, enum: ['continue_study', 'break', 'home', 'other'] },
  },
  { timestamps: true },
);

export type AttendanceDocument = InferSchemaType<typeof attendanceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AttendanceModel = mongoose.model('AttendanceRecord', attendanceSchema);
