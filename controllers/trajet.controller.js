const Trajet = require('../models/trajet.model');
const mongoose = require('mongoose');

// 📦 Créer un trajet (commun à VTC et covoiturage)
const createTrajet = async (req, res, type) => {
  try {
    const { lieuDepart, lieuArrivee, date, heure, places } = req.body;

    const trajet = new Trajet({
      chauffeur: req.user.id,
      type, // 'vtc' ou 'covoiturage'
      lieuDepart,
      lieuArrivee,
      date,
      heure,
      places,
    });

    await trajet.save();
    res.status(201).json({ message: `✅ Trajet ${type} créé avec succès`, trajet });
  } catch (error) {
    console.error(`❌ Erreur createTrajet (${type}) :`, error);
    res.status(500).json({ message: `Erreur lors de la création du trajet ${type}.` });
  }
};

// ➕ Créer un trajet VTC
const createVtcTrajet = (req, res) => createTrajet(req, res, 'vtc');

// ➕ Créer un trajet Covoiturage
const createCovoiturageTrajet = (req, res) => createTrajet(req, res, 'covoiturage');

// 📥 Réserver un trajet
const reserverTrajet = async (req, res) => {
  try {
    const trajet = await Trajet.findById(req.params.id);

    if (!trajet) return res.status(404).json({ message: 'Trajet introuvable' });
    if (trajet.chauffeur.toString() === req.user.id)
      return res.status(400).json({ message: 'Un chauffeur ne peut pas réserver son propre trajet' });
    if (trajet.passagers.includes(req.user.id))
      return res.status(400).json({ message: 'Vous avez déjà réservé ce trajet' });
    if (trajet.passagers.length >= trajet.places)
      return res.status(400).json({ message: 'Ce trajet est complet' });

    trajet.passagers.push(req.user.id);
    await trajet.save();

    res.status(200).json({ message: '✅ Réservation confirmée', trajet });
  } catch (error) {
    console.error('❌ Erreur reserverTrajet :', error);
    res.status(500).json({ message: 'Erreur lors de la réservation.' });
  }
};

// 📄 Voir tous les trajets
const getAllTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.find().populate('chauffeur', 'nom email');
    res.status(200).json(trajets);
  } catch (error) {
    console.error('❌ Erreur getAllTrajets :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des trajets.' });
  }
};

// 📌 Voir ses trajets réservés
const getReservedTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.find({ passagers: req.user.id }).populate('chauffeur', 'nom email');
    res.status(200).json(trajets);
  } catch (error) {
    console.error('❌ Erreur getReservedTrajets :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des trajets réservés.' });
  }
};

// 👤 Voir ses trajets créés
const getUserTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.find({ chauffeur: req.user.id });
    res.status(200).json(trajets);
  } catch (error) {
    console.error('❌ Erreur getUserTrajets :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des trajets créés.' });
  }
};

// ❌ Supprimer un trajet
const deleteTrajet = async (req, res) => {
  try {
    const trajet = await Trajet.findById(req.params.id);

    if (!trajet) return res.status(404).json({ message: 'Trajet introuvable' });
    if (trajet.chauffeur.toString() !== req.user.id)
      return res.status(403).json({ message: 'Non autorisé à supprimer ce trajet' });

    await trajet.deleteOne();
    res.status(200).json({ message: '✅ Trajet supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur deleteTrajet :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du trajet.' });
  }
};

// 🔍 Voir les trajets d’un utilisateur
const getTrajetsByUserId = async (req, res) => {
  try {
    const trajets = await Trajet.find({ chauffeur: req.params.userId }).populate('chauffeur', 'nom email');
    res.status(200).json(trajets);
  } catch (error) {
    console.error("❌ Erreur getTrajetsByUserId :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des trajets." });
  }
};

// 🔍 Voir uniquement les trajets VTC
const getVtcTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.find({ type: 'vtc' }).populate('chauffeur', 'nom');
    res.status(200).json(trajets);
  } catch (error) {
    console.error("❌ Erreur getVtcTrajets :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des trajets VTC." });
  }
};

// 🔍 Voir uniquement les trajets covoiturage
const getCovoiturageTrajets = async (req, res) => {
  try {
    const trajets = await Trajet.find({ type: 'covoiturage' }).populate('chauffeur', 'nom');
    res.status(200).json(trajets);
  } catch (error) {
    console.error("❌ Erreur getCovoiturageTrajets :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des trajets covoiturage." });
  }
};

// ✅ Exportation de toutes les fonctions
module.exports = {
  createVtcTrajet,
  createCovoiturageTrajet,
  reserverTrajet,
  getAllTrajets,
  getReservedTrajets,
  getUserTrajets,
  deleteTrajet,
  getTrajetsByUserId,
  getVtcTrajets,
  getCovoiturageTrajets,
};
