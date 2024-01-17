const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, uppercase: true },
    email: { type: String, required: true },
    aadhar_no: { type: String, required: true },
    dob: { type: Date, required: false },
    pan_no: { type: String, required: true },
    password: { type: String, default: null },
    role: { type: String, default: "user", enum: ["user", "admin", "superAdmin"] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Users", UsersSchema);
