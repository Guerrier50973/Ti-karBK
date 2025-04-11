// 📄 server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);

// ✅ Init WebSocket proprement
const { initSocket } = require('./services/socket.service');
initSocket(server); // ← Active le socket.io ici

// 🔐 Middlewares globaux
app.use(helmet());
app.use(morgan('dev'));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // autorise l'URL de ton app Expo
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Fichiers statiques (uploads d'images, PDF, etc.)
app.use('/uploads', express.static('uploads'));

// 📦 Routes API principales
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/trajets', require('./routes/trajet.routes'));
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/invoices', require('./routes/invoice.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/ratings', require('./routes/rating.routes'));
app.use('/api/locations', require('./routes/location.routes'));
app.use('/api/validation', require('./routes/validation.routes')); // ✅ Ajout de la route validation ici

// 🏠 Route de test
app.get('/', (req, res) => {
  res.send('🚀 Bienvenue sur le serveur Ti-Kar avec WebSocket');
});

// ✅ Vérification rapide
app.get('/api/version', (req, res) => {
  res.json({ version: '1.0.0', status: '✅ OK', env: process.env.NODE_ENV || 'dev' });
});

// ❌ 404 – route non trouvée
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable 🚫' });
});

// 💥 Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('💥 Erreur serveur :', err);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

// 🔗 Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connexion MongoDB réussie'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// 🚀 Démarrage serveur (Express + WebSocket)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur Ti-Kar + WebSocket : http://localhost:${PORT}`);
});
