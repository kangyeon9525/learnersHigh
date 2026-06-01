import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const growthHistorySchema = new Schema(
  {
    date: String,
    scoreDelta: Number,
    stage: Number,
  },
  { _id: false },
);

const monthlyArchiveSchema = new Schema(
  {
    month: String,
    totalScore: Number,
    finalStage: Number,
  },
  { _id: false },
);

const growthStateSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    lifetime: {
      totalScore: { type: Number, default: 0 },
      currentStage: { type: Number, default: 0 },
      history: { type: [growthHistorySchema], default: [] },
    },
    monthly: {
      currentMonth: { type: String, required: true },
      totalScore: { type: Number, default: 0 },
      currentStage: { type: Number, default: 0 },
      archive: { type: [monthlyArchiveSchema], default: [] },
    },
  },
  { timestamps: true },
);

export type GrowthStateDocument = InferSchemaType<typeof growthStateSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const GrowthStateModel = mongoose.model('GrowthState', growthStateSchema);
