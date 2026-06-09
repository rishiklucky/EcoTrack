const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
    },
    targetReduction: {
      type: Number,
      required: [true, 'Target reduction percentage/value is required'],
      min: [1, 'Target reduction must be at least 1%'],
      max: [100, 'Target reduction cannot exceed 100%'],
    },
    targetDate: {
      type: Date,
      required: [true, 'Target date is required'],
    },
    currentProgress: {
      type: Number,
      default: 0, // progress percentage (0 - 100)
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Add index on userId for fast query lookup
goalSchema.index({ userId: 1 });

module.exports = mongoose.model('Goal', goalSchema);
