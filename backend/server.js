const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./src/config/config");
// ROUTES
const authRoutes = require("./src/routes/authRoutes");
const coordinateRoutes = require("./src/routes/coordinateRoutes");
const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongoya başarılı bir şekilde bağlandı"))
  .catch((err) => console.log("Mongo Bağlantı hatasi:", err));

app.use("/api", authRoutes);
app.use("/api", coordinateRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server ${port}. portta calisiyor`);
});
