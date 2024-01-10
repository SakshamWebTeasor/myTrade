const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const apiRouteAll = require("./routes/index");
const mongoose = require("../config/database");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use("/api", apiRouteAll);

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${ms}ms`);
  });
  next();
});

app.use("/", (req, res) => {
  res.send(
    `Hello, Welcome to trade app!<br/><br/>Hitting:-<strong>${req.originalUrl}</strong><br/><br/>No Such Route Found`
  );
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (data) => {
    console.log("Received a message:", data);
    // Handle the incoming message
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Express WebSocket is listening on port ${port}`);
});
