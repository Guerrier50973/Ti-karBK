// 📁 middlewares/role.middleware.js

/**
 * Middleware pour restreindre l'accès aux utilisateurs selon leur rôle
 * @param  {...string} roles - Liste des rôles autorisés (ex: 'vtc', 'covoiturage', 'admin')
 */
exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    // Vérifie si l'utilisateur est connecté
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "⛔ Accès refusé : utilisateur non authentifié ou rôle manquant." });
    }

    const userRole = req.user.role;

    // Vérifie si le rôle est autorisé
    if (!roles.includes(userRole)) {
      console.warn(`🔒 Refus d'accès pour le rôle "${userRole}". Rôles autorisés : ${roles.join(', ')}`);
      return res.status(403).json({ message: "⛔ Accès refusé : rôle non autorisé." });
    }

    next(); // Autorisé, on passe à la suite
  };
};
