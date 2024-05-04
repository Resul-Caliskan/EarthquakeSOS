// socketConfig.js
const socketIo = require('socket.io');

let io;

// Initialize Socket.io server
exports.initializeSocket = (server) => {
    io = socketIo(server);
    io.on('connection', (socket) => {
        console.log('Client connected');
    });
};

// Get the Socket.io instance
exports.getSocketIo = () => {
    if (!io) {
        throw new Error('Socket.io has not been initialized');
    }
    return io;
};
