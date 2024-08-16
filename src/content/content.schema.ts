import * as mongoose from 'mongoose';

export const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    trail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trail',
      required: true,
    },
  },
  { timestamps: true, collection: 'contents' },
);

export interface Content extends mongoose.Document {
  title: string;
  body: string;
  trail: mongoose.Schema.Types.ObjectId;
}
