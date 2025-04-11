// 📁 routes/rating.routes.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

// ✅ Noter un chauffeur (passager uniquement)
router.post('/', verifyToken, allowRoles('passager'), ratingController.rateDriver);

// ✅ Voir les notes d’un chauffeur (accessible à tous rôles connectés)
router.get('/:id', verifyToken, allowRoles('admin', 'passager', 'chauffeur'), ratingController.getRatingsForDriver);

module.exports = router;
