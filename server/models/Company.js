const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  shortName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  lastScraped: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', CompanySchema);
