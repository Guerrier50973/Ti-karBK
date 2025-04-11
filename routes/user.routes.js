const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const userController = require('../controllers/user.controller');
const upload = require('../middlewares/upload.middleware');
const { verifyToken } = require('../middlewares/auth.middleware');
const { allowRoles } = require('../middlewares/role.middleware');
const { validateRequest } = require('../middlewares/validate.middleware'); // ✅ Gestion des erreurs express-validator

// ✅ Validation des champs pour l'inscription
const registerValidator = [
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('role')
    .notEmpty().withMessage('Le rôle est requis')
    .isIn(['passager', 'chauffeur']).withMessage('Le rôle doit être chauffeur ou passager'),
];

// 📝 Inscription (chauffeur avec fichiers ou passager simple)
router.post(
  '/register',
  upload.fields([
    { name: 'permis', maxCount: 1 },
    { name: 'assurance', maxCount: 1 },
    { name: 'carteGrise', maxCount: 1 },
    { name: 'photoVoiture', maxCount: 1 },
  ]),
  registerValidator,
  validateRequest,
  userController.register
);

// 🔐 Connexion
router.post('/login', userController.login);

// 👤 Voir son propre profil
router.get('/me', verifyToken, userController.getMyProfile);

// 📋 Voir tous les utilisateurs (admin)
router.get('/all', verifyToken, allowRoles('admin'), userController.getAllUsers);

// ✅ Valider un chauffeur
router.patch('/valider/:id', verifyToken, allowRoles('admin'), userController.validerChauffeur);

// ⏳ Chauffeurs en attente
router.get('/chauffeurs/en-attente', verifyToken, allowRoles('admin'), userController.getChauffeursEnAttente);

// ❌ Supprimer un utilisateur
router.delete('/:id', verifyToken, allowRoles('admin'), userController.deleteUser);

module.exports = router;
