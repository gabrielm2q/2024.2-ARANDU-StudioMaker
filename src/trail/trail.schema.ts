import * as mongoose from 'mongoose';

export const TrailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    journey: { type: mongoose.Schema.Types.ObjectId, ref: 'Journey' },
    contents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'trails' },
);

TrailSchema.pre('save', async function (next) {
  const trail = this as any;

  if (trail.order >= 0) {
    return next();
  }

  const lastTrail = await mongoose
    .model('Trail')
    .findOne({ journey: trail.journey })
    .sort({ order: -1 });

  trail.order = lastTrail ? lastTrail.order + 1 : 0;

  next();
});

export interface Trail extends mongoose.Document {
  name: string;
  journey: mongoose.Schema.Types.ObjectId;
  contents: mongoose.Types.ObjectId[];
  order: number;
}
