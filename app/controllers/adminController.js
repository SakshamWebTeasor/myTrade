const {
  getAllUsersS,
  createUserS,
  findTheLoginUserS,
} = require("../services/userService");

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

const deleteUserC = async (req, res) => {
  console.log("Delete user", req.user.role, req.params.id);
  const { users, error } = await findTheLoginUserS(null, null, req.params.id);
  console.log(users);
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
