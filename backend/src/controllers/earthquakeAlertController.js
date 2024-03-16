const { connectedClients } = require("../config/connectedClients");

exports.handleEarthquake = (req, res) => {
  const { message } = req.body;
 // rasathaneden gelen deprem bilgisi tüm kullanıcılara iletiliyor
  connectedClients.forEach((client) => {
    client.emit("earthquake", { message });
  });

  res.status(200).json({ success: true });
};
