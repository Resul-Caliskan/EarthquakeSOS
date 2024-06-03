// const http = require("http");
// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const config = require("./src/config/config");
// const CoordinateRoutes = require("./src/routes/coordinateRoutes");
// const AuthRoutes = require("./src/routes/authRoutes");
// const socketConfig = require("./src/config/notificationConfig");
// const notificationRoutes = require("./src/routes/notificationRoutes");

// const app = express();
// const dataDir = path.join(__dirname, "datas");
// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir);
// }
// app.use("/datas", express.static(dataDir));

// const server = http.createServer(app);
// socketConfig.initializeSocket(server);

// app.use(bodyParser.json());
// app.use(cors());

// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// app.use("/api", CoordinateRoutes);
// app.use("/api", AuthRoutes);
// app.use("/api/notifications", notificationRoutes);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });const express = require("express");
const http = require("http"); // Import http module
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const config = require("./src/config/config");
const { connectToMongo } = require("./src/config/mongo");
const CoordinateRoutes = require("./src/routes/coordinateRoutes");
const AuthRoutes = require("./src/routes/authRoutes");
const socketConfig = require("./src/config/notificationConfig");
const notificationRoutes = require("./src/routes/notificationRoutes");

const app = express();
const dataDir = path.join(__dirname, "datas");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
app.use("/datas", express.static(dataDir));

const server = http.createServer(app); // Create http server instance

socketConfig.initializeSocket(server); // Pass http server instance to initializeSocket function

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    connectToMongo(); // Connect to MongoDB and initialize GridFS bucket
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", CoordinateRoutes);
app.use("/api", AuthRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
