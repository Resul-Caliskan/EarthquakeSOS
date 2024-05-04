// notificationService.js
const socketConfig = require("../config/socketConfig");

// Send notification to all connected clients
exports.sendNotification = (message) => {
  socketConfig.io.emit("notification", { message });
};
