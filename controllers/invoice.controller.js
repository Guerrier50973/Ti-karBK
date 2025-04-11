// 📁 controllers/invoice.controller.js
const Invoice = require('../models/invoice.model');

exports.getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id }).populate('trajet');
    res.status(200).json(invoices);
  } catch (error) {
    console.error("❌ Erreur getMyInvoices :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des factures." });
  }
};

// (admin) toutes les factures
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('user trajet');
    res.status(200).json(invoices);
  } catch (error) {
    console.error("❌ Erreur getAllInvoices :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
