// 📁 routes/notification.routes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// 🔔 Obtenir ses notifications
router.get('/', verifyToken, notificationController.getMyNotifications);

// ✅ Marquer une notification comme lue
router.patch('/:id/read', verifyToken, notificationController.markAsRead);

// (optionnel) Admin crée une notification manuelle
router.post('/', verifyToken, notificationController.createNotification); // Ajoute checkRole('admin') si besoin

module.exports = router;
