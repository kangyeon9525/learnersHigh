import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const aiEventSchema = new Schema(
  {
    at: { type: String, required: true },
    status: { type: String, enum: ['focus', 'distracted'], required: true },
  },
  { _id: false },
);

const studySessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startedAt: { type: String, required: true },
    endedAt: { type: String },
    focusMinutes: { type: Number, default: 0 },
    satisfaction: { type: Number, min: 1, max: 5 },
    completed: { type: Boolean, default: false },
    aiEvents: { type: [aiEventSchema], default: [] },
  },
  { timestamps: true },
);

export type StudySessionDocument = InferSchemaType<typeof studySessionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const StudySessionModel = mongoose.model('StudySession', studySessionSchema);
