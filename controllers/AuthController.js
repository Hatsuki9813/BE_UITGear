const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passport = require("passport");
require("../config/auth");
class AuthController {
  async register(req, res) {
    try {
      const { email, username, password_hash } = req.body;

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
      }

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username đã được sử dụng" });
      }

      const hashedPassword = await bcrypt.hash(password_hash, 10);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

      const newUser = new User({
        email,
        username,
        password_hash: hashedPassword,
        otp,
        otpExpiry,
      });

      await newUser.save();

      // Gửi email chứa mã OTP
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Mã OTP xác thực tài khoản",
        text: `Mã OTP của bạn là: ${otp}`,
      });

      res.status(201).json({
        message:
          "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async verifyOtp(req, res) {
    const { email, otp } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User không tồn tại" });
      }

      if (user.otp !== otp || user.otpExpiry < new Date()) {
        return res
          .status(400)
          .json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
      }

      user.otp = null;
      user.otpExpiry = null;
      user.is_active = true;
      await user.save();

      res
        .status(200)
        .json({ message: "Xác thực thành công. Tài khoản đã được kích hoạt." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async resendOtp(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User không tồn tại" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Mã OTP xác thực tài khoản",
        text: `Mã OTP mới của bạn là: ${otp}. Mã sẽ hết hạn sau 15 phút.`,
      });

      res
        .status(200)
        .json({ message: "Mã OTP mới đã được gửi tới email của bạn." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async login(req, res) {
    const { identifier, password } = req.body;
    console.log("", identifier, password);
    try {
      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Invalid username/email or password" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } 
  async forgetPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Email không tồn tại trong hệ thống." });
      }

      // Tạo mã OTP và thời gian hết hạn
      const otp = Math.floor(100000 + Math.random() * 900000); // OTP 6 chữ số
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // Hết hạn sau 15 phút

      // Cập nhật OTP và thời gian hết hạn
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      // Gửi email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Mã OTP đặt lại mật khẩu",
        text: `Mã OTP của bạn là: ${otp}. Mã sẽ hết hạn sau 15 phút.`,
      });

      res
        .status(200)
        .json({ message: "Mã OTP đã được gửi đến email của bạn." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } 
  async resetPassword(req, res) {
    const { email, otp, newPassword } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Email không tồn tại." });
      }

      // Kiểm tra OTP và hạn sử dụng
      if (user.otp !== otp || user.otpExpiry < Date.now()) {
        return res
          .status(400)
          .json({ message: "OTP không hợp lệ hoặc đã hết hạn." });
      }

      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password_hash = hashedPassword;
      user.otp = null;
      user.otpExpiry = null;

      await user.save();

      res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async changePassword(req, res) {
    const { email, password, newPassword } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User không tồn tại." });
      }

      // Kiểm tra mật khẩu hiện tại
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res
          .status(403)
          .json({ message: "Mật khẩu hiện tại không đúng." });
      }

      // Kiểm tra mật khẩu mới có trùng với mật khẩu cũ không
      const isSamePassword = await bcrypt.compare(
        newPassword,
        user.password_hash
      );
      if (isSamePassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu mới không được trùng với mật khẩu cũ." });
      }

      // Cập nhật mật khẩu mới
      user.password_hash = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.status(200).json({ message: "Cập nhật mật khẩu thành công." });
    } catch (err) {
      res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại." });
    }
  }

  async logout(req, res) {
    try {
      res.cookie("token", "", { expires: new Date(0), httpOnly: true });

      res.status(200).json({ message: "Đăng xuất thành công." });
    } catch (err) {
      res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại." });
    }
  }

  async loginWithGoogle(req, res, next) {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  }
  async callBackGoogle(req, res, next) {
    passport.authenticate(
      "google",
      { failureRedirect: "/" },
      async (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ message: "Đăng nhập Google thất bại." });
        }

        try {
          const { id, displayName, emails,photo } = user;

          let existingUser = await User.findOne({ googleId: id });
          if (!existingUser) {
            existingUser = new User({
              googleId: id,
              fullname: displayName,
              email: emails[0].value,
              image: photo
            });
            await existingUser.save();
          }

          // Tạo token JWT
          const token = jwt.sign(
            { userId: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          res.status(200).json({ token });
        } catch (error) {
          console.error('Login error:', error);
          res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại." });
        }
      }
    )(req, res, next);
  }
}

module.exports = new AuthController();
