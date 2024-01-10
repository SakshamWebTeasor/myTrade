const { getAllUsersS, createUserS } = require("../services/userService");

const createUserC = async (req, res) => {
  if (req.body.password != req.body.confirmPassword) {
    return res.status(400).json({
      status: 400,
      message: "Password and Confirm Password does not match",
    });
  }
  const { user, error } = await createUserS({
    ...req.body,
    confirmPassword: undefined,
  });
  return res.status(error ? 400 : 200).json({
    user,
    status: error ? 400 : 200,
    message: error ? error : "Create user",
  });
};

const getAllUsersC = async (req, res) => {
  const { users, error } = await getAllUsersS();
  console.log(users);
  res.status(200).json({ users, error, status: 200, message: "Get all users" });
};

const getMyUserDetailC = async (req, res) => {
  res
    .status(200)
    .json({ users: [req.user], status: 200, message: "My User Detail" });
};

const deleteUserC = (req, res) => {
  res.status(200).json({ message: "Delete user" });
};

const updateUserC = (req, res) => {
  res.status(200).json({ message: "Update user" });
};

module.exports = {
  createUserC,
  getAllUsersC,
  getMyUserDetailC,
  deleteUserC,
  updateUserC,
};
