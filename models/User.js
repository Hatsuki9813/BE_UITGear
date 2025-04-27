const mongoose = require("mongoose");
require("mongoose-timestamp");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true }, // Thêm trường facebookId
    username: {
      type: String,
      required: function () {
        return !this.googleId && !this.facebookId;
      },
      trim: true,
      unique: true,
    },
    password_hash: {
      type: String,
      required: function () {
        return !this.googleId && !this.facebookId;
      },
    },
    fullname: {
      type: String,
      required: function () {
        return !this.googleId && !this.facebookId;
      },
      trim: true,
      default: "",
    },
    dob: { type: Date, default: null },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    address: { type: String, default: null },
    email: {
      type: String,
      required: function () {
        return !this.googleId && !this.facebookId;
      },
      unique: true,
      lowercase: true,
      default: "",
    },
    otp: { type: String },
    otpExpiry: { type: Date, default: null },
    is_active: { type: Boolean, default: false },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

// Tạo index cho email (tìm kiếm nhanh)
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
