const Review = require('../models/review.model');

exports.createReview = async (req, res) => {
  try {
    const { trajet, note, commentaire } = req.body;

    const newReview = new Review({
      trajet,
      auteur: req.user.id,
      note,
      commentaire,
    });

    await newReview.save();
    res.status(201).json({ message: '✅ Évaluation enregistrée', review: newReview });
  } catch (error) {
    console.error('❌ Erreur createReview :', error);
    res.status(500).json({ message: 'Erreur lors de la création de l’évaluation.' });
  }
};

exports.getReviewsByTrajet = async (req, res) => {
  try {
    const reviews = await Review.find({ trajet: req.params.trajetId }).populate('auteur', 'nom');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('❌ Erreur getReviewsByTrajet :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des évaluations.' });
  }
};
