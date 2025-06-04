const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/query/:query/:page", UserController.getUserByQuery);
router.put("/", UserController.updateUserByEmail);
router.post("/shipping-addresses", UserController.createShippingAddress);
router.put("/shipping-addresses", UserController.updateShippingAddress);
router.delete("/shipping-addresses", UserController.deleteShippingAddress);
router.get("/:id", UserController.getUserById);
router.delete("/:id", UserController.deleteUserById);
router.get("/all/:page", UserController.getAllUsers);

module.exports = router;
