const { generateToken } = require("../Helper/generateLoginToken");
const { findTheLoginUserS, createUserS } = require("../services/userService");

const sayHiTest = (req, res) => {
  res.status(200).json({ message: "Hello, Express API!" });
};

const sendDataTest = (req, res) => {
  const requestData = req.body;
  res.status(201).json({ message: "Data received", data: requestData });
};

const handleLoginC = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Login Failed",
      error: "Email and password are required",
      status: 400,
    });
  }
  const { users, error } = await findTheLoginUserS(email, password);
  let myUserData;
  if (users) {
    myUserData = await generateToken(users[0]);
  } else {
    return res.status(401).json({
      message: "Login Failed",
      error: "Invalid email or password, " + error,
      status: 401,
    });
  }
  res.status(200).json({
    message: "Login successful",
    token: myUserData.token,
    error,
    user: { ...myUserData.theUser, _id: undefined },
    status: 200,
  });
};

const handleRegisterC = async (req, res) => {
  const {
    name,
    gender,
    email,
    aadhar_no,
    pan_no,
    mobile_no,
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
    role: "user", // by registration method, only user can be created
    confirmPassword: undefined,
  });
  let myUserData = await generateToken(user);
  return res.status(error ? 400 : 201).json({
    users: [user],
    status: error ? 400 : 201,
    token: myUserData.token,
    user: { ...myUserData.theUser, _id: undefined },
    message: error ? "User Creation Failed" : "User Created",
    error: error == "" ? null : error,
  });
};

module.exports = { sayHiTest, sendDataTest, handleLoginC, handleRegisterC };
