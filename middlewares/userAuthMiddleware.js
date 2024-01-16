const dotenv = require("dotenv").config();
const secretKey = process.env.SECRET_KEY || "12rtu20@s";
const jwt = require("jsonwebtoken");
const { findTheLoginUserS } = require("../app/services/userService");
const { useLevelFilter } = require("../app/Helper/filterUserData");

const authorize = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ data: {}, status: 401, message: "Token not provided" });
  }
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ data: {}, status: 401, message: "Invalid token Or Expired" });
    }
    if (!decoded.role.includes("user")) {
      return res.status(403).json({
        data: {},
        status: 401,
        message: "Unauthorized, Please login as User",
      });
    }
    const {
      users: [user],
    } = await findTheLoginUserS(null, null, decoded._id);
    if (user && user.role === "user") {
      req.user = useLevelFilter(user);
    } else {
      return res.status(404).json({
        data: {},
        status: 404,
        message: "User not found",
      });
    }
    next();
  });
};

const authorizeAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ data: {}, status: 401, message: "Token not provided" });
  }
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ data: {}, status: 401, message: "Invalid token Or Expired" });
    }
    if (
      !decoded.role.includes("admin") &&
      !decoded.role.includes("superAdmin")
    ) {
      return res.status(403).json({
        data: {},
        status: 401,
        message: "Unauthorized, Please login as Admin",
      });
    }
    const {
      users: [user],
    } = await findTheLoginUserS(null, null, decoded._id);
    if (user && (user.role === "admin" || user.role === "superAdmin")) {
      req.user = {...useLevelFilter(user), mobile_no:user.mobile};
    } else {
      return res.status(404).json({
        data: {},
        status: 404,
        message: "User not found",
      });
    }
    next();
  });
};

module.exports = { authorize, authorizeAdmin };
