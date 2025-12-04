import mongoose from 'mongoose';

const clubStatsSchema = mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Club',
    },
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number, // 1-12
      required: true,
    },
    newMembersCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

clubStatsSchema.index({ club: 1, year: 1, month: 1 }, { unique: true });

const ClubStats = mongoose.model('ClubStats', clubStatsSchema);

export default ClubStats;