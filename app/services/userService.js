const { hashPassword } = require("../Helper/generateLoginToken");
const {
  isValidMobile,
  isValidEmail,
  genderCheck,
  isValidPassword,
  isValidPan,
  isValidAadhar,
  isValidRole,
} = require("../Helper/validFields");
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");

const requiredFields = [
  "password",
  "name",
  "gender",
  "email",
  "aadhar_no",
  "pan_no",
  "mobile_no",
  "role",
];

const sanitizeReq = (body) => {
  const errors = [];
  const otherError = [];
  const transformField = (field, validator) => {
    const data = validator(body[field]);
    let { valid, value, message } = data;
    if (!valid) otherError.push(message);
    body[field] = value;
  };

  requiredFields.forEach((field) => {
    if (!body[field]) errors.push(field);
    switch (field) {
      case "password":
        transformField(field, isValidPassword);
        break;
      case "mobile_no":
        transformField(field, isValidMobile);
        break;
      case "email":
        transformField(field, isValidEmail);
        break;
      case "gender":
        transformField(field, genderCheck);
        break;
      case "pan_no":
        transformField(field, isValidPan);
        break;
      case "aadhar_no":
        transformField(field, isValidAadhar);
        break;
      case "role":
        transformField(field, isValidRole);
        break;
    }
  });

  const error =
    errors.length > 0 || otherError.length > 0
      ? `Missing fields: [${errors.join(", ")}]${
          otherError.length > 0
            ? ` & Validity Errors: [${otherError.join(", ")}]`
            : ""
        }`
      : "";
  return { body, isError: error !== "", error };
};

const getAllUsersS = async () => {
  try {
    const users = await Users.find();
    return { users, error: null };
  } catch (error) {
    return { error, users: null };
  }
};

const createUserS = async (body) => {
  try {
    const { body: myBody, error, isError } = sanitizeReq(body);
    console.log(myBody, isError);
    if (isError) return { error, user: null };
    const user = await Users.create({
      ...myBody,
      password: await hashPassword(myBody.password),
    });
    return { user, error: error };
  } catch (error) {
    return { error, user: null };
  }
};

const findTheLoginUserS = async (email, password, _id) => {
  try {
    if (_id) {
      const user = await Users.findById(_id);
      if (!user) {
        return { users: null, error: "User not found" };
      }
      return { users: [user], error: null };
    } else {
      const users = await Users.find({ email }).sort({ _id: -1 }).limit(1);
      if (users.length === 0) {
        return { users: null, error: "User not found" };
      } else {
        if (!(await bcrypt.compare(password, users[0].password))) {
          return { users: null, error: "Incorrect password" };
        }
      }
      return { users, error: null };
    }
  } catch (error) {
    return { error, users: null };
  }
};

module.exports = { getAllUsersS, findTheLoginUserS, createUserS };
