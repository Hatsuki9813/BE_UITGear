const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passport = require("passport");
require("../config/auth");
class AuthController {
    async register(req, res) {
        try {
            const { email, phone, name, password } = req.body;
            console.log("Register request received", req.body);
            // Kiểm tra email đã tồn tại chưa
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email đã được sử dụng" });
            }

            // Kiểm tra số điện thoại đã tồn tại chưa
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) {
                return res.status(402).json({ message: "Số điện thoại đã được sử dụng" });
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo mã OTP 6 chữ số (hết hạn sau 15 phút)
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

            // Tạo user mới
            const newUser = new User({
                username: email,
                email,
                phone,
                fullname: name,
                password_hash: hashedPassword,
                otp,
                otpExpiry,
                is_active: false, // Đánh dấu chưa xác minh
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
                subject: "Xác thực tài khoản - UITGear",
                text: `Mã OTP của bạn là: ${otp} (có hiệu lực trong 15 phút).`,
            });

            res.status(201).json({
                message: "Đăng ký thành công!",
            });
        } catch (err) {
            res.status(500).json({ message: "Lỗi server: " + err.message });
        }
    }
    async verifyOtp(req, res) {
        const { email, otp } = req.body;
        console.log("otp recieved", req.body);
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User không tồn tại" });
            }

            if (user.otp !== otp || user.otpExpiry < new Date()) {
                return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
            }

            user.otp = null;
            user.otpExpiry = null;
            user.is_active = true;
            await user.save();

            res.status(200).json({ message: "Xác thực thành công. Tài khoản đã được kích hoạt." });
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

            res.status(200).json({ message: "Mã OTP mới đã được gửi tới email của bạn." });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async login(req, res) {
        const { email, password } = req.body;
        console.log("", email, password);
        try {
            const user = await User.findOne({
                email: email,
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid username/email or password" });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            res.status(200).json({ user, token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async forgetPassword(req, res) {
        console.log("Forget password request received", req.body);
        const { email } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "Email không tồn tại trong hệ thống." });
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

            res.status(200).json({ message: "Mã OTP đã được gửi đến email của bạn." });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async resetPassword(req, res) {
        const { email, newPassword } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "Email không tồn tại." });
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
            const isMatch = bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(403).json({ message: "Mật khẩu hiện tại không đúng." });
            }

            // Kiểm tra mật khẩu mới có trùng với mật khẩu cũ không
            const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
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
        passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
    }
    async callBackGoogle(req, res, next) {
        passport.authenticate("google", { failureRedirect: "/" }, async (err, user) => {
            if (err || !user) {
                return res.send(`<script>
          window.opener.postMessage({ error: 'Google login failed' }, '*');
          window.close();
        </script>`);
            }

            try {
                const { sub, name, email, picture } = user._json;

                let existingUser = await User.findOne({ googleId: sub });
                if (!existingUser) {
                    existingUser = new User({
                        googleId: sub,
                        fullname: name,
                        email,
                        image: picture,
                    });
                    await existingUser.save();
                }

                console.log("User after Google login:", existingUser);

                const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                });

                console.log("Google login token:", token);

                // Gửi token và user info về frontend
                return res.send(`<script>
          window.opener.postMessage({
            token: "${token}",
            user: {
              name: ${JSON.stringify(name)},
              email: ${JSON.stringify(email)},
              picture: ${JSON.stringify(picture)}
            }
          }, "*");
          window.close();
        </script>`);
            } catch (error) {
                console.error("Google callback error:", error);
                return res.send(`<script>
          window.opener.postMessage({ error: "Internal error" }, "*");
          window.close();
        </script>`);
            }
        })(req, res, next);
    }

    async callBackFacebook(req, res, next) {
        console.log("Facebook callback triggered");

        passport.authenticate("facebook", { failureRedirect: "/" }, async (err, user) => {
            console.log("Inside passport.authenticate callback");

            // Kiểm tra lỗi và thông tin người dùng
            if (err) {
                console.log("Error during Facebook authentication:", err);
            }
            if (!user) {
                console.log("User not found:", user);
                return res.send(safeSend({ error: "Facebook login failed" }));
            }

            // Tạo JWT token
            try {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                });

                console.log("User after Facebook login:", user);

                // Dữ liệu gửi về phía client
                const dataToSend = {
                    token,
                    user: {
                        name: user.fullname,
                        email: user.email,
                        picture: user.image,
                    },
                };

                return res.send(safeSend(dataToSend));
            } catch (error) {
                console.error("Error creating JWT token:", error);
                return res.send(safeSend({ error: "Internal error" }));
            }
        })(req, res, next);

        // Hàm trả về dữ liệu tới cửa sổ mở
        function safeSend(data) {
            console.log("Sending response:", data); // Debugging

            return `
      <script>
        (function() {
          const payload = ${JSON.stringify(data)};
          if (window.opener) {
            window.opener.postMessage(payload, "*");
            window.close();
          } else {
            window.close();
          }
        })();
      </script>
    `;
        }
    }
}

module.exports = new AuthController();
