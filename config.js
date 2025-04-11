// 📁 config/config.js (ou db.js)
// Chargement des variables d'environnement
require('dotenv').config();

// ✅ Export des configurations clés
module.exports = {
  mongoURI: process.env.MONGO_URI || '',     // URI MongoDB (Atlas ou local)
  jwtSecret: process.env.JWT_SECRET || 'default-secret', // Sécurité JWT fallback
  port: process.env.PORT || 3000             // Port par défaut si non défini
};
