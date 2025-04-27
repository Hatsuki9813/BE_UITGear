const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

const authenticate = require("../middleware/auth");
router.post("/register", AuthController.register);
router.post("/verify-otp", AuthController.verifyOtp);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgetPassword);
router.put("/reset-password", AuthController.resetPassword);
router.put("/change-password", AuthController.changePassword);

//google auth
router.get("/google", AuthController.loginWithGoogle);
router.get("/google/callback", AuthController.callBackGoogle);
//facebook auth
// router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));
// router.get("/facebook/callback", callBackFacebook);
router.get("/logout", AuthController.logout);

router.get("/me", authenticate, (req, res) => {
  res.json(req.user); // Trả về user đã được attach ở middleware
});
module.exports = router;
