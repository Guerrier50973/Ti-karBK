const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');

// 💳 Créditer le portefeuille utilisateur via Stripe
exports.creditWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Montant invalide.' });
    }

    // 1. Récupérer ou créer le portefeuille
    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) wallet = await Wallet.create({ user: userId, balance: 0 });

    // 2. Ajouter le montant
    wallet.balance += amount;
    await wallet.save();

    // 3. Enregistrer la transaction
    await Transaction.create({
      user: userId,
      amount,
      type: 'credit',
      description: 'Recharge portefeuille'
    });

    res.status(200).json({ message: '✅ Portefeuille crédité avec succès', wallet });
  } catch (err) {
    console.error('❌ Erreur creditWallet :', err);
    res.status(500).json({ message: 'Erreur lors du crédit du portefeuille.' });
  }
};

// 👛 Obtenir le solde du portefeuille
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: 'Portefeuille introuvable' });
    }

    res.status(200).json(wallet);
  } catch (err) {
    console.error('❌ Erreur getWallet :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération du portefeuille.' });
  }
};

// 📜 Voir l'historique des transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error('❌ Erreur getTransactions :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des transactions.' });
  }
};
