const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");
const cors = require('cors')
const swaggerUi = require("swagger-ui-express");

const apiRouteAll = require("./routes/index");
const mongoose = require("../config/database");
const { autoGenerateDocumentation } = require("../config/serverDocsGen");
const swaggerDocument = require("../swagger.json");


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 4000;

app.use(cors())
app.use(bodyParser.json());

app.use(function (req, res, next) {
  const start = Date.now();
  res.once("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${duration}ms`);
  });
  next();
});

app.use("/api", apiRouteAll);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/", (req, res) => {
  res.send(
    `Hello, Welcome to trade app!<br/><br/>Hitting:-<strong>${req.originalUrl}</strong><br/><br/>No Such Route Found`
  );
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (data) => {
    console.log("Received a message:", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  setInterval(() => {
    autoGenerateDocumentation(); // auto re-generate swagger docs after every hour
  }, 60 * 60 * 1000);
  console.log(`Express WebSocket is listening on port ${port}`);
});
