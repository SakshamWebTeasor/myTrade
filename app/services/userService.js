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
const {
  createNewMobile,
  mobileExistenceCheck,
} = require("./verifiedMobileService");
const { ObjectId } = require("mongodb");
const { filterUndefinedFields } = require("../Helper/filterUndefinedFields");

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

const requiredUpdateFields = ["name", "gender"];

const sanitizeReq = (body, requiredField) => {
  const errors = [];
  const otherError = [];
  const transformField = (field, validator) => {
    const data = validator(body[field]);
    let { valid, value, message } = data;
    if (!valid) otherError.push(message);
    body[field] = value;
  };

  requiredField.forEach((field) => {
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

const getAllUsersS = async (managebleRoles) => {
  try {
    const users = await Users.find({ role: { $in: managebleRoles } });
    return { users, error: null };
  } catch (error) {
    return { error, users: null };
  }
};

const createUserS = async (body) => {
  try {
    const { body: myBody, error, isError } = sanitizeReq(body, requiredFields);
    if (isError) return { error, user: null };
    const { error: EmailError } = await emailExistenceCheck(myBody.email);
    if (EmailError) return { user: null, error: EmailError };
    const { error: MobileError } = await mobileExistenceCheck(myBody.mobile_no);
    if (MobileError) return { user: null, error: MobileError };
    const user = await Users.create({
      ...myBody,
      mobile_no: undefined,
      password: await hashPassword(myBody.password),
    });
    await createNewMobile({
      number: myBody.mobile_no,
      role: myBody.role,
      user_id: user._id,
    });
    return { user, error: error };
  } catch (error) {
    return { error, user: null };
  }
};

const emailExistenceCheck = async (email) => {
  try {
    const users = await Users.find({ email }).sort({ _id: -1 }).limit(1);
    if (users.length > 0) {
      return {
        user: users[0],
        error: "Email already taken",
      };
    } else {
      return {
        user: null,
        error: null,
      };
    }
  } catch (error) {
    return { user: null, error };
  }
};

const aggToFindCompleteUserById = (_id) => [
  {
    $match: {
      _id: new ObjectId(_id),
    },
  },
  {
    $lookup: {
      from: "verifiedmobiles",
      localField: "_id",
      foreignField: "user_id",
      as: "mobiles",
    },
  },
  {
    $project: {
      _id: 1,
      name: 1,
      gender: 1,
      email: 1,
      aadhar_no: 1,
      pan_no: 1,
      password: 1,
      role: 1,
      created_at: 1,
      mobile: {
        $arrayElemAt: ["$mobiles.number", 0],
      },
    },
  },
];

const aggToFindCompleteUserByEmail = (email) => [
  {
    $match: {
      email,
    },
  },
  {
    $lookup: {
      from: "verifiedmobiles",
      localField: "_id",
      foreignField: "user_id",
      as: "mobiles",
    },
  },
  {
    $project: {
      _id: 1,
      name: 1,
      gender: 1,
      email: 1,
      aadhar_no: 1,
      pan_no: 1,
      password: 1,
      role: 1,
      created_at: 1,
      mobile: {
        $arrayElemAt: ["$mobiles.number", 0],
      },
    },
  },
  {
    $sort: {
      _id: -1,
    },
  },
  {
    $limit: 1,
  },
];

const findTheLoginUserS = async (email, password, _id) => {
  try {
    if (_id) {
      const user = await Users.aggregate(aggToFindCompleteUserById(_id));
      return { users: user, error: user.length > 0 ? null : "User not found" };
    } else {
      const users = await Users.aggregate(aggToFindCompleteUserByEmail(email));
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
    return { error: "User not found", users: null };
  }
};

const deleteTheUser = async (_id) => {
  try {
    const deletedUser = await Users.deleteOne({ _id });
    return { deletedUser, error: null };
  } catch (error) {
    return { deletedUser: null, error };
  }
};

const updateTheUser = async (_id, body) => {
  try {
    const user_id = new ObjectId(_id);
    console.log(body);
    const {
      body: myBody,
      error,
      isError,
    } = sanitizeReq(body, requiredUpdateFields);
    if (isError) return { error, user: null };
    const user = await Users.findById(user_id);
    if (!user) {
      return { users: null, error: "User not found" };
    }
    let myNewBody = {
      ...user._doc,
      ...filterUndefinedFields(myBody),
      _id: undefined,
      updated_at: new Date(),
    };
    const userUpdate = await Users.updateOne({ _id: user_id }, myNewBody);
    return { user: userUpdate, error: error };
  } catch (error) {
    return { error, user: null };
  }
};

module.exports = {
  getAllUsersS,
  findTheLoginUserS,
  createUserS,
  deleteTheUser,
  updateTheUser,
};
