const mongoose = require('mongoose');

const validationRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: String,
  vtcNumber: String,
  documentUrl: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ValidationRequest', validationRequestSchema);
