// 📁 models/rating.model.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  trajet: { type: mongoose.Schema.Types.ObjectId, ref: 'Trajet', required: true },
  passager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: Number, min: 1, max: 5, required: true },
  commentaire: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
