const { Server } = require('socket.io');

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    socket.on('join_room', (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on('send_chat', ({ senderId, recipientId, message }) => {
      io.to(`user_${recipientId}`).emit('receive_chat', {
        senderId,
        message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('telematics_alert', ({ ownerId, equipmentId, alertType, location }) => {
      io.to(`user_${ownerId}`).emit('geofence_warning', {
        equipmentId,
        alertType,
        location,
        timestamp: new Date().toISOString(),
      });
    });
  });

  return io;
}

module.exports = { initSocket };
