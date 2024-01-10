const express = require("express");
const { getAllUsersC, createUserC, getMyUserDetailC, deleteUserC } = require("../controllers/adminController");
const router = express.Router();

// Define a GET route
router.get("/getUsers", getAllUsersC);
router.get("/myProfile", getMyUserDetailC);

// Define a POST route
router.post("/user", createUserC);

// Define a Delete route
router.delete("/user/:id", deleteUserC);

module.exports = router;
