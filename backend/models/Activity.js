const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transportation: {
      carKm: { type: Number, default: 0 },
      vehicleType: {
        type: String,
        enum: ['electric', 'hybrid', 'gasoline', 'diesel'],
        default: 'gasoline',
      },
      bikeKm: { type: Number, default: 0 },
      transitKm: { type: Number, default: 0 },
      flightHrs: { type: Number, default: 0 },
    },
    energy: {
      electricityKwh: { type: Number, default: 0 },
      lpgKg: { type: Number, default: 0 },
      waterLitres: { type: Number, default: 0 },
    },
    food: {
      dietType: {
        type: String,
        enum: ['vegan', 'vegetarian', 'mixed', 'meat-heavy'],
        default: 'mixed',
      },
    },
    waste: {
      recyclingRate: { type: Number, default: 0 }, // percentage 0 to 100
      plasticUsage: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
      },
    },
    calculatedScore: {
      type: Number,
      required: true,
      default: 0, // In kg CO2e
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add index on userId and date to avoid multiple logs for the same day
activitySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Activity', activitySchema);
