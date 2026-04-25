const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  seasons: {
    type: [String],
    required: true,
    enum: ['winter', 'spring', 'summer', 'fall']
  },
  budget: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  groupTypes: {
    type: [String],
    required: true,
    enum: ['single', 'couple', 'family']
  },
  activities: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries on common filter fields
destinationSchema.index({ country: 1 });
destinationSchema.index({ 'budget.min': 1, 'budget.max': 1 });
destinationSchema.index({ seasons: 1 });
destinationSchema.index({ activities: 1 });

module.exports = mongoose.model('Destination', destinationSchema);
