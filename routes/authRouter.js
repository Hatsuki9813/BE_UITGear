const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/register", AuthController.register);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/login", AuthController.login);
router.post("/forget-password", AuthController.forgetPassword);
router.put("/reset-password", AuthController.resetPassword);
router.put("/change-password", AuthController.changePassword);
router.get("/google", AuthController.loginWithGoogle);
router.get("/google/callback", AuthController.callBackGoogle);
router.get("/logout", AuthController.logout);

module.exports = router;
