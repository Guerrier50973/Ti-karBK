// 📁 payment/payment.routes.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// 💳 Créditer le portefeuille
router.post('/credit', verifyToken, paymentController.creditWallet);

// 👛 Obtenir son portefeuille
router.get('/wallet', verifyToken, paymentController.getWallet);

// 📜 Voir ses transactions
router.get('/transactions', verifyToken, paymentController.getTransactions);


module.exports = router;
