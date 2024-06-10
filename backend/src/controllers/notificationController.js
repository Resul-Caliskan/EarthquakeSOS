const notificationService = require("../services/notificationService");

// Handle incoming notification requests
exports.sendNotification = (req, res) => {
  const { message } = req.body;
  notificationService.sendNotification(message);
  res.status(200).send("Notification sent");
};
