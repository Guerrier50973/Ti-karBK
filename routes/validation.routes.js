// 📄 routes/validation.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const validationController = require('../controllers/validationController');
const { verifyToken } = require('../middlewares/auth.middleware');
const { adminMiddleware } = require('../middlewares/admin.middleware');

// 📦 Configuration pour multer (upload des fichiers)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// 📤 Soumettre la validation
router.post('/submit', verifyToken, upload.single('document'), validationController.submitValidation);

// 📊 Récupérer le statut de la demande de validation
router.get('/status', verifyToken, validationController.getMyStatus);

// 📄 routes/validation.routes.js

// Ajoute cette route juste après les autres
router.get('/admin/validations', verifyToken, adminMiddleware, validationController.getAllValidationRequests);


module.exports = router;
