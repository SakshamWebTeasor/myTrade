const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const Users = require("../app/models/userModel");
const Products = require("../app/models/productModel");
const { createUserS } = require("../app/services/userService");

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI)
  .then((res) => {
    console.log("mongodb connected");
    listCollectionTables();
  })
  .catch((err) => console.log("Unable to connect with DB"));

async function listCollectionTables() {
  const userCount = await Users.countDocuments();
  if (userCount === 0) {
    console.log("Users collection is empty");
    await createDefaultTableData();
  }
}

const createDefaultTableData = async () => {
  console.log("creating initial default tables");
  const defaultUser = {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    gender: process.env.ADMIN_GENDER,
    mobile_no: process.env.ADMIN_MOBILE,
    role: process.env.ADMIN_ROLE,
    aadhar_no: process.env.ADMIN_AADHAR,
    pan_no: process.env.ADMIN_PAN,
  };
  await createUserS(defaultUser);
  console.log("admin data created");
};

module.exports = mongoose;
