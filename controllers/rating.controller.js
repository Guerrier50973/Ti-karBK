const Rating = require('../models/rating.model');

exports.rateDriver = async (req, res) => {
  try {
    const { trajetId, note, commentaire, chauffeurId } = req.body;

    // Vérifie si le passager a déjà noté ce trajet
    const existing = await Rating.findOne({ trajet: trajetId, passager: req.user.id });
    if (existing) {
      return res.status(400).json({ message: '⚠️ Vous avez déjà noté ce trajet.' });
    }

    const rating = new Rating({
      trajet: trajetId,
      passager: req.user.id,
      chauffeur: chauffeurId,
      note,
      commentaire
    });

    await rating.save();
    res.status(201).json({ message: "✅ Notation enregistrée", rating });
  } catch (err) {
    console.error("❌ Erreur rateDriver :", err);
    res.status(500).json({ message: "Erreur lors de l'enregistrement de la note." });
  }
};

exports.getRatingsForDriver = async (req, res) => {
  try {
    const ratings = await Rating.find({ chauffeur: req.params.id })
      .sort({ createdAt: -1 })
      .populate('passager', 'nom');

    res.status(200).json(ratings);
  } catch (err) {
    console.error("❌ Erreur getRatingsForDriver :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des notes." });
  }
};
