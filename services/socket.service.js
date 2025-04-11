// 📁 services/socket.service.js
let io;

const initSocket = (server) => {
  const socketIo = require('socket.io');
  io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  io.on('connection', (socket) => {
    console.log('✅ Nouveau client connecté :', socket.id);

    // Exemple : réception d’un nouveau trajet
    socket.on('new_trajet', (data) => {
      console.log('📡 Nouveau trajet reçu :', data);
      io.emit('new_trajet', data);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client déconnecté :', socket.id);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket.io non initialisé !");
  return io;
};

module.exports = { initSocket, getIO };
