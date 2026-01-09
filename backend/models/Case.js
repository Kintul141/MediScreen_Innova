const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageFilename: {
    type: String,
    required: true,
  },
  aiOutput: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  status: {
    type: String,
    enum: ['uploaded', 'processed', 'doctor_review', 'published'],
    default: 'uploaded',
  },
  patientNotes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
    default: null,
  },
  assignedAt: {
    type: Date,
    default: null,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Case', caseSchema);
