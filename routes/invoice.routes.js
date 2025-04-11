// 📁 routes/invoice.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const invoiceController = require('../controllers/invoice.controller');

// 🧾 Voir ses factures
router.get('/', verifyToken, invoiceController.getMyInvoices);

// 🧾 Voir toutes les factures (admin uniquement)
router.get('/admin', verifyToken, allowRoles('admin'), invoiceController.getAllInvoices);

module.exports = router;
