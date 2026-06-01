import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const goalSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cycle: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    rewardScore: { type: Number, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type GoalDocument = InferSchemaType<typeof goalSchema> & { _id: mongoose.Types.ObjectId };

export const GoalModel = mongoose.model('Goal', goalSchema);
