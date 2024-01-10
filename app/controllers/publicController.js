const { generateToken } = require("../Helper/generateLoginToken");
const { findTheLoginUserS } = require("../services/userService");

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
  let token;
  if (users) {
    token = generateToken(users[0]);
  } else {
    return res
      .status(401)
      .json({ message: "Invalid email or password", error });
  }
  res.status(200).json({ message: "Login successful", token });
};

module.exports = { sayHiTest, sendDataTest, handleLoginC };
