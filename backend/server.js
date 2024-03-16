const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./src/config/config");
const socketIo = require("socket.io");
const http = require("http");
// ROUTES
const authRoutes = require("./src/routes/authRoutes");
const coordinateRoutes = require("./src/routes/coordinateRoutes");
const earthquakeRoutes = require("./src/routes/earthquakeRoutes");
const { connectedClients } = require("./src/config/connectedClients");
const User = require("./src/models/user");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongoya başarılı bir şekilde bağlandı"))
  .catch((err) => console.log("Mongo Bağlantı hatasi:", err));

//SocketIO ISTEMCILER
io.on("connection", (socket) => {
  console.log(`İstemci bağlandı: ${socket.id}`);
  connectedClients.add(socket);

  //Kullanıcı konumlarını güncelleme
  socket.on("updateLocation", async ({ id, username, location }) => {
    console.log(
      `Kullanıcı ${username} için konum güncellemesi alındı:`,
      location
    );

    // MongoDB'de kullanıcıyı güncelle
    await User.findByIdAndUpdate(id, { location }, { upsert: true });
  });

  socket.on("disconnect", () => {
    console.log(`İstemci bağlantısı kesildi: ${socket.id}`);
    connectedClients.delete(socket);
  });
});

//Endpointler
app.use("/api", authRoutes);
app.use("/api", coordinateRoutes);
app.use("/api", earthquakeRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server ${port}. portta calisiyor`);
});
