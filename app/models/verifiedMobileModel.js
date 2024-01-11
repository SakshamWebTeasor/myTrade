const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const verifiedMobile = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  user_id: {
    type: ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("verifiedMobile", verifiedMobile);
