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

// Middleware de pré-salvamento para ajustar a ordem
TrailSchema.pre('save', async function (next) {
  const trail = this as any;

  // Se a trilha já tiver uma ordem definida, não faz nada
  if (trail.order >= 0) {
    return next();
  }

  // Encontrar a trilha com a maior ordem na mesma jornada
  const lastTrail = await mongoose.model('Trail').findOne({ journey: trail.journey }).sort({ order: -1 });

  // Definir a ordem como a próxima na sequência, começando em 0
  trail.order = lastTrail ? lastTrail.order + 1 : 0;

  next();
});

export interface Trail extends mongoose.Document {
  name: string;
  journey: mongoose.Schema.Types.ObjectId;
  contents: mongoose.Types.ObjectId[];
  order: number;
}