const dotenv = require("dotenv").config();
const secretKey = process.env.SECRET_KEY || "12rtu20@s";
const jwt = require("jsonwebtoken");
const { showLevelFilter } = require("./filterUserData");
const bcrypt = require("bcrypt");
const { findUserMobile } = require("../services/verifiedMobileService");

async function generateToken(user) {
  let theUser = showLevelFilter(user);
  const token = jwt.sign(theUser, secretKey, { expiresIn: "1h" });
  return { token, theUser: { ...theUser, mobile: user.mobile } };
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

module.exports = { generateToken, hashPassword };
