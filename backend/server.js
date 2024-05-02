const socketIo = require('socket.io');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectedClients } = require('./src/config/connectedClients');
const config = require('./src/config/config');
const earthquakeController = require('./src/controllers/earthquakeAlertController');
const CoordinateRoutes = require('./src/routes/coordinateRoutes');
const AuthRoutes= require("./src/routes/authRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// WebSocket connections
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  connectedClients.add(socket);

  // Disconnect event
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    connectedClients.delete(socket);
  });
});

// Endpoint to handle earthquakes
app.use('/api/earthquake', earthquakeController.handleEarthquake);
app.use("/api",CoordinateRoutes);
app.use("/api",AuthRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
