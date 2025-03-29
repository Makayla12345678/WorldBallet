const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true,
    ref: 'Company'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    default: ''
  },
  isPast: {
    type: Boolean,
    default: false
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  isNext: {
    type: Boolean,
    default: false
  },
  lastScraped: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for checking if performance is current
PerformanceSchema.virtual('isCurrentPerformance').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
});

// Method to update current and next performance flags
PerformanceSchema.statics.updatePerformanceFlags = async function(companyId) {
  const now = new Date();
  
  // Reset all flags for this company
  await this.updateMany(
    { company: companyId },
    { isCurrent: false, isNext: false }
  );
  
  // Find and mark current performances
  const currentPerformances = await this.find({
    company: companyId,
    startDate: { $lte: now },
    endDate: { $gte: now }
  });
  
  for (const performance of currentPerformances) {
    performance.isCurrent = true;
    await performance.save();
  }
  
  // Find and mark next performance
  const nextPerformance = await this.findOne({
    company: companyId,
    startDate: { $gt: now }
  }).sort({ startDate: 1 });
  
  if (nextPerformance) {
    nextPerformance.isNext = true;
    await nextPerformance.save();
  }
};

module.exports = mongoose.model('Performance', PerformanceSchema);
