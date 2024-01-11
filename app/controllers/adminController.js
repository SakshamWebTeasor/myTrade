const { RolesCanManage } = require("../Helper/filterUserData");
const {
  getAllUsersS,
  createUserS,
  findTheLoginUserS,
  deleteTheUser,
} = require("../services/userService");
const { deleteMobile } = require("../services/verifiedMobileService");

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
  return res.status(error ? 400 : 201).json({
    user,
    status: error ? 400 : 201,
    message: error ? error : "User Created",
  });
};

const getAllUsersC = async (req, res) => {
  const { users, error } = await getAllUsersS(RolesCanManage[req.user.role]);
  res.status(200).json({ users, error, status: 200, message: "Get all users" });
};

const getMyUserDetailC = async (req, res) => {
  return res
    .status(200)
    .json({ users: [req.user], status: 200, message: "My User Detail" });
};

const deleteUserC = async (req, res) => {
  const { users, error } = await findTheLoginUserS(null, null, req.params.id);
  if (error) return res.status(400).json({ message: error, users: null });
  const { error: deleteMobError } = await deleteMobile(users[0].mobile_no);
  if (deleteMobError)
    return res.status(400).json({ message: deleteMobError, users: null });
  const { deletedUser, error: deleteUserError } = deleteTheUser(req.params.id);
  if (deleteUserError)
    return res.status(400).json({ message: deleteUserError, users: null });
  res.status(200).json({ message: "User Deleted", deletedUser });
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
