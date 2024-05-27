// socketConfig.js
const socketIo = require("socket.io");
const User = require("../models/user");
let io;

exports.initializeSocket = (server) => {
  io = socketIo(server);
  io.on("connection", (socket) => {
    console.log("Client connected");
    io.on("emergency", async (response) => {
      const id = response.id;
      const message = response.message;
      const record = response.record;
      const coordinate = response.coordinate;
      const date = response.date;
      const user = await User.findById(id);

      io.emit("emergencyWeb", {
        id: id,
        coordinate: coordinate,
        message: message,
        record: record,
        name:user.name,
        healthInfo:user.healthInfo,
        time: date,
      });
    });
  });
};
exports.getSocketIo = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }
  return io;
};
