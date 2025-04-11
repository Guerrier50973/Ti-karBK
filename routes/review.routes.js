const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');

// 👤 Laisser un avis
router.post(
  '/',
  verifyToken,
  allowRoles('passager'),
  reviewController.createReview
);

// 👀 Voir les avis pour un trajet
router.get(
  '/trajet/:trajetId',
  verifyToken,
  allowRoles('admin', 'passager', 'chauffeur'),
  reviewController.getReviewsByTrajet
);

module.exports = router;
