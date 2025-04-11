// 📄 middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // ✅ Vérifie si le header contient "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: "⛔ Token manquant ou mal formé (attendu: Bearer <token>)" });
  }

  const token = authHeader.split(' ')[1]; // extrait le token après "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // injecte les infos utilisateur dans req.user
    next(); // passe au middleware suivant
  } catch (error) {
    return res.status(401).json({ message: "⛔ Token invalide ou expiré" });
  }
};
