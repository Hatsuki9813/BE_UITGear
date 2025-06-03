const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
const route = require("./routes");
const connectDB = require("./config/db");
const cors = require("cors");
const passport = require("passport");
require("./config/auth");
const app = express();

// Cấu hình CORS với các tùy chọn phù hợp cho session và credentials
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"], // Chỉ định domain của frontend
        methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức được phép
        allowedHeaders: ["Content-Type", "Authorization"], // Các headers được phép
        credentials: true, // Cho phép cookies và credentials
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Đảm bảo secure: false khi bạn không sử dụng HTTPS trong môi trường phát triển
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((err, req, res, next) => {
    console.error("Error stack:", err.stack);
    res.status(500).send("Đã xảy ra lỗi trên server.");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

connectDB();
route(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
