const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: String,
  email: String,
  motDePasse: String, // ← corriger ici pour matcher avec le controller
  role: {
    type: String,
    enum: ['vtc', 'covoiturage'],
    default: 'covoiturage',
    required: true
  },
  
  // 🔐 Docs pour chauffeur VTC
  docs: {
    permis: String,
    assurance: String,
    carteGrise: String,
    photoVoiture: String,
  },
  validationVTC: {
    type: String,
    enum: ['en_attente', 'valide', 'refuse'],
    default: 'en_attente',
  }
});

module.exports = mongoose.model('User', userSchema);
