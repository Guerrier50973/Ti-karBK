// 📁 controllers/notification.controller.js
const Notification = require('../models/notification.model');

exports.createNotification = async (req, res) => {
  try {
    const { title, message, userId } = req.body;

    const notification = new Notification({
      title,
      message,
      user: userId
    });

    await notification.save();
    res.status(201).json({ message: 'Notification envoyée', notification });
  } catch (error) {
    console.error('❌ Erreur createNotification :', error);
    res.status(500).json({ message: 'Erreur lors de la création de la notification.' });
  }
};

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('❌ Erreur getMyNotifications :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications.' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOne({ _id: id, user: req.user.id });
    if (!notif) return res.status(404).json({ message: 'Notification non trouvée' });

    notif.isRead = true;
    await notif.save();
    res.status(200).json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error('❌ Erreur markAsRead :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
  }
};
