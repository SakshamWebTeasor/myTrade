const express = require("express");
const {
  getAllUsersC,
  createUserC,
  getMyUserDetailC,
  deleteUserC,
  updateUserC,
} = require("../controllers/adminController");
const router = express.Router();

// Define a GET route
router.get("/getUsers", getAllUsersC);
router.get("/myProfile", getMyUserDetailC);

// Define a POST route
router.post("/user", createUserC);

// Define a Delete route
router.delete("/user/:id", deleteUserC);

// Define PUT route
router.put("/user/:id", updateUserC);

module.exports = router;
