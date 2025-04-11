// 📄 middlewares/admin.middleware.js

exports.adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); // ✅ accès autorisé
    } else {
      return res.status(403).json({ message: "⛔ Accès interdit : utilisateur non autorisé" });
    }
  };
  