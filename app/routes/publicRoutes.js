const express = require("express");
const {
  sayHiTest,
  sendDataTest,
  handleLoginC,
  handleRegisterC,
} = require("../controllers/publicController");
const router = express.Router();

// Define a GET route
router.get("/data", sayHiTest);

// Define a POST route
router.post("/data", sendDataTest);
router.post("/login", handleLoginC);
router.post("/register", handleRegisterC);

module.exports = router;
