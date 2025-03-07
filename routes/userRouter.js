const express = require('express');
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/", UserController.getAllUser)
router.get("/:id", UserController.getUserById)
router.put("/:id", UserController.updateUserById)
router.delete("/:id", UserController.deleteUserById)

module.exports = router;


