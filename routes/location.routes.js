// 📁 routes/location.routes.js
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// 🔄 Mettre à jour la position de l'utilisateur connecté
router.post('/update', verifyToken, locationController.updateLocation);

// 🔍 Voir la position d’un utilisateur par ID
router.get('/:userId', verifyToken, locationController.getUserLocation);

module.exports = router;
