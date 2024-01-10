const express = require("express");
const router = express.Router();

const publicApiRoutes = require("./publicRoutes");
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const {
  authorize,
  authorizeAdmin,
} = require("../../middlewares/userAuthMiddleware");

// Group routes directly under /api path
router.use("/", publicApiRoutes);

// Group routes under /api/admin path
router.use("/admin", authorizeAdmin, adminRoutes);

// Group routes under /api/user path
router.use("/user", authorize, userRoutes);

module.exports = router;
