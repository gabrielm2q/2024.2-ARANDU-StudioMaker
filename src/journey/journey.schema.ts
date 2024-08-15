import * as mongoose from 'mongoose';

export const JourneySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, collection: 'journeys' },
);

export interface Journey extends mongoose.Document {
  title: string;
  description: string;
  user: mongoose.Schema.Types.ObjectId;
}
