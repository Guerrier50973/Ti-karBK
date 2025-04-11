// 📁 models/review.model.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    trajet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trajet',
      required: true,
    },
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    note: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    commentaire: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
