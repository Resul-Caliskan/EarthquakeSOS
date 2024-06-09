const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./src/config/config");
const { connectToMongo } = require("./src/config/mongo");
const CoordinateRoutes = require("./src/routes/coordinateRoutes");
const AuthRoutes = require("./src/routes/authRoutes");
const AuthWebRoutes = require("./src/routes/authWebRoutes");
const socketConfig = require("./src/config/notificationConfig");
const notificationRoutes = require("./src/routes/notificationRoutes");
const teamRoutes = require("./src/routes/teamRoutes");

const callRoutes = require("./src/routes/callRoutes");
const UserRoutes = require("./src/routes/userRoutes");

const app = express();

const server = http.createServer(app);

socketConfig.initializeSocket(server);

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    connectToMongo();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", CoordinateRoutes);
app.use("/api", AuthRoutes);
app.use("/api", UserRoutes);
app.use("/api/web", AuthWebRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", teamRoutes);
app.use("/api", callRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
