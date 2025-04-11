const ValidationRequest = require('../models/ValidationRequest');

exports.submitValidation = async (req, res) => {
  try {
    const { fullName, vtcNumber } = req.body;

    const documentUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const existing = await ValidationRequest.findOne({ user: req.user.id });

    if (existing) {
      existing.fullName = fullName;
      existing.vtcNumber = vtcNumber;
      existing.documentUrl = documentUrl || existing.documentUrl;
      existing.status = 'pending';
      existing.updatedAt = Date.now();
      await existing.save();
    } else {
      await ValidationRequest.create({
        user: req.user.id,
        fullName,
        vtcNumber,
        documentUrl,
      });
    }

    res.status(200).json({ message: 'Demande envoyée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur soumission', error });
  }
};

exports.getMyStatus = async (req, res) => {
  try {
    const demande = await ValidationRequest.findOne({ user: req.user.id });

    if (!demande) {
      return res.json({ status: null });
    }

    res.json({
      status: demande.status,
      updatedAt: demande.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur récupération', error });
  }
};
// 📄 controllers/validationController.js

exports.getAllValidationRequests = async (req, res) => {
    try {
      // Récupérer toutes les demandes de validation
      const requests = await ValidationRequest.find()
        .populate('user', 'name email') // pour avoir les infos de l'utilisateur
        .sort({ updatedAt: -1 }); // trie les demandes par date décroissante
  
      res.status(200).json(requests);
    } catch (error) {
      console.error('❌ Erreur récupération des demandes :', error);
      res.status(500).json({ message: 'Erreur récupération des demandes de validation' });
    }
  };
  