const { RolesCanManage } = require("../Helper/filterUserData");
const {
  getAllUsersS,
  createUserS,
  findTheLoginUserS,
  deleteTheUser,
  updateTheUser,
} = require("../services/userService");
const { deleteMobile } = require("../services/verifiedMobileService");

const createUserC = async (req, res) => {
  const {
    name,
    gender,
    email,
    aadhar_no,
    pan_no,
    mobile_no,
    role,
    password,
    confirmPassword,
  } = req.body;
  if (password != confirmPassword) {
    return res.status(400).json({
      status: 400,
      message: "User Creation Failed",
      error: "Password and Confirm Password does not match",
    });
  }
  const { user, error } = await createUserS({
    ...req.body,
    confirmPassword: undefined,
  });
  return res.status(error ? 400 : 201).json({
    users: [user],
    status: error ? 400 : 201,
    message: error ? "User Creation Failed" : "User Created",
    error: error == "" ? null : error,
  });
};

const getAllUsersC = async (req, res) => {
  const { users, error } = await getAllUsersS(RolesCanManage[req.user.role]);
  res.status(200).json({ users, error, status: 200, message: "Get all users" });
};

const getMyUserDetailC = async (req, res) => {
  return res
    .status(200)
    .json({
      users: [req.user],
      status: 200,
      message: "My User Detail",
      error: req.user ? null : "User not found",
    });
};

const deleteUserC = async (req, res) => {
  const { users, error } = await findTheLoginUserS(null, null, req.params.id);
  if (error || users.length <= 0)
    return res
      .status(400)
      .json({ message: "User Deletion Failed", error, status: 400 });
  const { error: deleteMobError } = await deleteMobile(users[0].mobile);
  if (deleteMobError)
    return res
      .status(400)
      .json({
        message: "User Deletion Failed",
        error: deleteMobError,
        status: 400,
      });
  const { deletedUser, error: deleteUserError } = deleteTheUser(req.params.id);
  if (deleteUserError)
    return res
      .status(400)
      .json({
        message: "User Deletion Failed",
        error: deleteUserError,
        status: 400,
      });
  res
    .status(200)
    .json({ message: "User Deleted", deletedUser, status: 200, error: null });
};

const updateUserC = async (req, res) => {
  const { user, error } = await updateTheUser(req.params.id, {
    name: undefined,
    gender: undefined,
    name: req.body.name,
    gender: req.body.gender,
    ...req.body,
    password: undefined,
    confirmPassword: undefined,
    role: undefined,
    aadhar_no: undefined,
    pan_no: undefined,
    mobile_no: undefined,
  });
  return res.status(error || user.modifiedCount <= 0 ? 400 : 200).json({
    users: [user],
    status: error || user.modifiedCount <= 0 ? 400 : 200,
    message:
      error || user.modifiedCount <= 0 ? "Update Failed" : "User Updated",
    error: error == "" ? null : error,
  });
};

module.exports = {
  createUserC,
  getAllUsersC,
  getMyUserDetailC,
  deleteUserC,
  updateUserC,
};
