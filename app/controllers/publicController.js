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
    return res.status(400).json({ message: "Email and password are required" });
  }
  const { users, error } = await findTheLoginUserS(email, password);
  let myUserData;
  if (users) {
    myUserData = await generateToken(users[0]);
  } else {
    return res
      .status(401)
      .json({ message: "Invalid email or password", error });
  }
  res
    .status(200)
    .json({
      message: "Login successful",
      token: myUserData.token,
      user: { ...myUserData.theUser, _id: undefined },
    });
};

const handleRegisterC = async (req, res) => {
  const { name, gender, email, aadhar_no, pan_no, mobile_no, password, confirmPassword} = req.body;
  if (req.body.password != req.body.confirmPassword) {
    return res.status(400).json({
      status: 400,
      message: "Password and Confirm Password does not match",
    });
  }
  const { user, error } = await createUserS({
    ...req.body,
    role: "user", // by registration method, only user can be created
    confirmPassword: undefined,
  });
  return res.status(error ? 400 : 201).json({
    users:[user],
    status: error ? 400 : 201,
    message: error ? error : "User Created",
  });
};

module.exports = { sayHiTest, sendDataTest, handleLoginC, handleRegisterC };
