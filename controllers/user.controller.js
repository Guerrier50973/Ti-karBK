const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// 📤 Inscription
exports.register = async (req, res) => {
  try {
    const { nom, email, motDePasse, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const newUser = new User({
      nom,
      email,
      motDePasse: hashedPassword,
      role,
    });

    // 🚗 Docs chauffeur
    if (role === 'chauffeur') {
      newUser.docs = {
        permis: req.files?.permis?.[0]?.filename || '',
        assurance: req.files?.assurance?.[0]?.filename || '',
        carteGrise: req.files?.carteGrise?.[0]?.filename || '',
        photoVoiture: req.files?.photoVoiture?.[0]?.filename || '',
      };
      newUser.validationVTC = 'en_attente';
    }

    await newUser.save();

    // ✅ Génération du token avec email et role
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '✅ Inscription réussie',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('❌ Erreur register :', err);
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};

// 🔐 Connexion
exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Identifiants incorrects' });

    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) return res.status(401).json({ message: 'Identifiants incorrects' });

    // ✅ Génération du token avec email et role
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token, user });
  } catch (err) {
    console.error('❌ Erreur login :', err);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

// 👤 Profil utilisateur
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-motDePasse');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Erreur getMyProfile :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
};

// 🛡️ Admin : valider chauffeur
exports.validerChauffeur = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      validationVTC: 'valide'
    }, { new: true });

    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    res.status(200).json({ message: '✅ Chauffeur validé', user });
  } catch (err) {
    console.error('❌ Erreur validerChauffeur :', err);
    res.status(500).json({ message: 'Erreur lors de la validation' });
  }
};

// 👥 Tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-motDePasse');
    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Erreur getAllUsers :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
};

// ⏳ Chauffeurs en attente
exports.getChauffeursEnAttente = async (req, res) => {
  try {
    const users = await User.find({
      role: 'chauffeur',
      validationVTC: 'en_attente'
    }).select('-motDePasse');

    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Erreur getChauffeursEnAttente :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération' });
  }
};

// ❌ Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Facultatif : supprimer les fichiers uploadés du chauffeur
    if (user.role === 'chauffeur' && user.docs) {
      Object.values(user.docs).forEach((filename) => {
        if (filename) {
          const filePath = path.join(__dirname, '../uploads', filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }

    res.status(200).json({ message: '✅ Utilisateur supprimé' });
  } catch (err) {
    console.error('❌ Erreur deleteUser :', err);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};
