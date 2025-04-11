/// 📁 routes/trajet.routes.js

const express = require('express');
const router = express.Router();
const trajetController = require('../controllers/trajet.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

// 🔍 Test rapide pour vérifier si la fonction est bien définie
console.log('🧪 createVtcTrajet:', typeof trajetController.createVtcTrajet);

// 🔧 Créer un trajet — VTC uniquement
router.post(
  '/vtc',
  verifyToken,
  allowRoles('vtc'),
  trajetController.createVtcTrajet
);

// 🔧 Créer un trajet — Covoiturage uniquement
router.post(
  '/covoiturage',
  verifyToken,
  allowRoles('covoiturage'),
  trajetController.createCovoiturageTrajet
);

// 📥 Réserver un trajet — tous rôles connectés (hors admin)
router.post(
  '/:id/reserver',
  verifyToken,
  allowRoles('covoiturage', 'vtc'),
  trajetController.reserverTrajet
);

// 📍 Tous les trajets disponibles (publics) — pour passagers connectés
router.get(
  '/disponibles',
  verifyToken,
  allowRoles('covoiturage', 'vtc'),
  trajetController.getAllTrajets
);

// 📌 Voir ses trajets réservés — renommé pour + de clarté
router.get(
  '/mes-reservations',
  verifyToken,
  allowRoles('covoiturage', 'vtc'),
  trajetController.getReservedTrajets
);

// 👤 Voir ses trajets créés — conducteur
router.get(
  '/mes-trajets',
  verifyToken,
  allowRoles('vtc', 'covoiturage'),
  trajetController.getUserTrajets
);

// ❌ Supprimer un trajet — uniquement le créateur
router.delete(
  '/:id',
  verifyToken,
  allowRoles('vtc', 'covoiturage'),
  trajetController.deleteTrajet
);

// 🔍 Voir les trajets d’un utilisateur — admin uniquement
router.get(
  '/user/:userId',
  verifyToken,
  allowRoles('admin'),
  trajetController.getTrajetsByUserId
);

// 🟢 Voir tous les trajets VTC — pour VTC uniquement
router.get(
  '/vtc/list',
  verifyToken,
  allowRoles('vtc'),
  trajetController.getVtcTrajets
);

// 🟢 Voir tous les trajets covoiturage — pour covoiturage uniquement
router.get(
  '/covoiturage/list',
  verifyToken,
  allowRoles('covoiturage'),
  trajetController.getCovoiturageTrajets
);

module.exports = router;
