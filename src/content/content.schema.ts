import * as mongoose from 'mongoose';

export const ContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trail: { type: mongoose.Schema.Types.ObjectId, ref: 'Trail' },
    journey: { type: mongoose.Schema.Types.ObjectId, ref: 'Journey' }, 
  },
  { timestamps: true, collection: 'contents' },
);

export interface Content extends mongoose.Document {
  title: string;
  body: string;
  user: mongoose.Schema.Types.ObjectId; 
  trail?: mongoose.Schema.Types.ObjectId; 
  journey?: mongoose.Schema.Types.ObjectId; 
}
