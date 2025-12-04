import mongoose from 'mongoose';

const statisticsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    totalLivrosLidos: {
      type: Number,
      default: 0,
    },
    totalPaginasLidas: {
      type: Number,
      default: 0,
    },
    generosLidos: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Statistics = mongoose.model('Statistics', statisticsSchema);

export default Statistics;