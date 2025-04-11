const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
  lieuDepart: {
    type: String,
    required: true
  },
  lieuArrivee: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  heure: {
    type: String,
    required: true
  },
  places: {
    type: Number,
    min: 1,
    required: function () {
      return this.type === 'covoiturage';
    }
  },
  chauffeur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  passagers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  prix: {
    type: Number,
    required: false
  },
  type: {
    type: String,
    enum: ['vtc', 'covoiturage'],
    default: 'covoiturage'
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirme', 'termine', 'annule'],
    default: 'en_attente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Trajet', trajetSchema);
