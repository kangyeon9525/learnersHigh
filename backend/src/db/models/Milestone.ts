import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const milestoneSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    conditionCode: { type: String, required: true },
    rewardScore: { type: Number, required: true },
    isAchieved: { type: Boolean, default: false },
    achievedAt: { type: String },
  },
  { timestamps: true },
);

export type MilestoneDocument = InferSchemaType<typeof milestoneSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const MilestoneModel = mongoose.model('Milestone', milestoneSchema);
