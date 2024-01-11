const express = require("express");
const {
  getAllUsersC,
  createUserC,
  getMyUserDetailC,
  deleteUserC,
  updateUserC,
} = require("../controllers/adminController");
const router = express.Router();

router.get("/getUsers", getAllUsersC);
router.get("/myProfile", getMyUserDetailC);

router.post("/user", createUserC);

router.delete("/user/:id", deleteUserC);

router.put("/user/:id", updateUserC);

module.exports = router;
