// 📁 models/invoice.model.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trajet: { type: mongoose.Schema.Types.ObjectId, ref: 'Trajet' },
  amount: Number,
  method: { type: String, enum: ['carte', 'espece'] },
  status: { type: String, enum: ['payé', 'en_attente'], default: 'payé' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
