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
    users: [user],
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
  if (error || users.length <= 0) return res.status(400).json({ message: error, status: 400 });
  const { error: deleteMobError } = await deleteMobile(users[0].mobile);
  if (deleteMobError)
    return res.status(400).json({ message: deleteMobError, status: 400 });
  const { deletedUser, error: deleteUserError } = deleteTheUser(req.params.id);
  if (deleteUserError)
    return res.status(400).json({ message: deleteUserError });
  res.status(200).json({ message: "User Deleted", deletedUser, status: 200 });
};

const updateUserC = async (req, res) => {
  const { user, error } = await updateTheUser(req.params.id, {
    name: undefined,
    gender: undefined,
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
    message: error
      ? error
      : user.modifiedCount > 0
      ? "User Updated"
      : "Update Failed",
  });
};

module.exports = {
  createUserC,
  getAllUsersC,
  getMyUserDetailC,
  deleteUserC,
  updateUserC,
};
