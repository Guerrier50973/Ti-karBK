// 📁 models/location.model.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    role: {
      type: String,
      enum: ['chauffeur', 'passager'],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Location', locationSchema);
