// socketConfig.js
const socketIo = require("socket.io");

let io;

exports.initializeSocket = (server) => {
  io = socketIo(server);
  io.on("connection", (socket) => {
    console.log("Client connected");
  });
};
exports.getSocketIo = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }
  return io;
};
