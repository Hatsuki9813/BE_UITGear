const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded token:", decoded); // 👈 Thêm dòng này

        const user = await User.findById(decoded.id).select("-password_hash");

        if (!user) {
            console.log("❌ User not found with ID:", decoded.id); // 👈 Thêm dòng này
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("❌ Token error:", err); // 👈 In rõ lỗi
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authenticate;
