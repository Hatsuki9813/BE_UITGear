const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/", UserController.getAllUser);
router.put("/", UserController.updateUserByEmail);
router.post("/shipping-addresses", UserController.createShippingAddress);
router.put("/shipping-addresses", UserController.updateShippingAddress);
router.delete("/shipping-addresses", UserController.deleteShippingAddress);
router.get("/:id", UserController.getUserById);
router.delete("/:id", UserController.deleteUserById);

module.exports = router;
