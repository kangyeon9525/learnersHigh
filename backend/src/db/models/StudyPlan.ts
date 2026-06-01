import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const studyPlanSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    plannedDate: { type: String, required: true, index: true },
    sortOrder: { type: Number, required: true, default: 0 },
    durationMinutes: { type: Number },
    completed: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

studyPlanSchema.index({ userId: 1, plannedDate: 1, sortOrder: 1 });

export type StudyPlanDocument = InferSchemaType<typeof studyPlanSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const StudyPlanModel = mongoose.model('StudyPlan', studyPlanSchema);
