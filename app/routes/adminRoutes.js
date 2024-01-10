const express = require("express");
const { getAllUsersC, createUserC, getMyUserDetailC } = require("../controllers/adminController");
const router = express.Router();

// Define a GET route
router.get("/getUsers", getAllUsersC);
router.get("/myProfile", getMyUserDetailC);

// Define a POST route
router.post("/user", createUserC);

module.exports = router;
