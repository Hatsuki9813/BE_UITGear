const mongoose = require('mongoose');
require('mongoose-timestamp');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String, required:  function() { return !this.googleId; } , trim: true,unique: true , },
  password_hash: { type: String, required: function() { return !this.googleId; }  },
  fullname: { type: String, trim: true,default: "" },
  dob: { type: Date , default: "" },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
  address: { type: String,default: "" },
  email: { type: String, required:  function() { return !this.googleId; } , unique: true, lowercase: true,default: "" },
  otp: { type: String }, // Mã OTP (nếu có)
  otpExpiry:{type: Date, default: ""},
  is_active: { type: Boolean, default: false },
},{timestamps:true});

// Tạo index cho email (tìm kiếm nhanh)

module.exports = mongoose.model('User', userSchema);