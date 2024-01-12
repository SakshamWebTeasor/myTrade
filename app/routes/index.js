const express = require("express");
const router = express.Router();

const publicApiRoutes = require("./publicRoutes");
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const {
  authorize,
  authorizeAdmin,
} = require("../../middlewares/userAuthMiddleware");

router.use("/", publicApiRoutes);

router.use("/admin", authorizeAdmin, adminRoutes);

router.use("/user", authorize, userRoutes);

module.exports = router;
