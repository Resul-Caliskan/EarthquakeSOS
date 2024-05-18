// notificationService.js
const socketConfig = require("../config/notificationConfig");

// Send notification to all connected clients
exports.sendNotification = (message) => {
  const io = socketConfig.getSocketIo();
  io.emit("notification", { message: message });
  console.log("Mesaj: ",message);

};
