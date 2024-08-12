import * as mongoose from 'mongoose';

export const TrailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    journey: { type: mongoose.Schema.Types.ObjectId, ref: 'Journey' },
  },
  { timestamps: true, collection: 'trails' },
);