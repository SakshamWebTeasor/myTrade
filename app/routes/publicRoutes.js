const express = require("express");
const {
  sayHiTest,
  sendDataTest,
  handleLoginC,
  handleRegisterC,
} = require("../controllers/publicController");
const router = express.Router();

router.get("/data", sayHiTest);

router.post("/data", sendDataTest);
router.post("/login", handleLoginC);
router.post("/register", handleRegisterC);

module.exports = router;
