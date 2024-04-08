// config/socketConfig.js
const socketIo = require('socket.io');

let io;

const initializeSocket = (server) => {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    // Handle user connection
    socket.on('userConnect', (userId) => {
      console.log(`User ${userId} connected`);
      
      // You can implement logic to update user's socket ID in the database here
    });

    // Handle another connection
    socket.on('anotherConnect', (receiverId) => {
      console.log(`Receiver ${receiverId} connected`);
      
      // You can implement logic to update receiver's socket ID in the database here
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
      
      // You can implement logic to remove socket ID from the database here
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket has not been initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIo };
