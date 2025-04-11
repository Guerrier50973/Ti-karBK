// 📁 controllers/location.controller.js
const Location = require('../models/location.model');

// 🔄 Mettre à jour la position
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, role } = req.body;
    const userId = req.user.id;

    let location = await Location.findOne({ user: userId });
    if (location) {
      location.latitude = latitude;
      location.longitude = longitude;
      location.role = role;
    } else {
      location = new Location({ user: userId, latitude, longitude, role });
    }

    await location.save();
    res.status(200).json({ message: '✅ Position mise à jour', location });
  } catch (error) {
    console.error('❌ Erreur updateLocation :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la position' });
  }
};

// 🔍 Voir la position d’un utilisateur
exports.getUserLocation = async (req, res) => {
  try {
    const location = await Location.findOne({ user: req.params.userId }).populate('user', 'nom role');
    if (!location) return res.status(404).json({ message: 'Position non trouvée' });

    res.status(200).json(location);
  } catch (error) {
    console.error('❌ Erreur getUserLocation :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la position' });
  }
};
