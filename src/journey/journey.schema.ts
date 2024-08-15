import * as mongoose from 'mongoose';

export const JourneySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true, collection: 'journeys' },
);
