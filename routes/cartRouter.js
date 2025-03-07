const express = require('express');
const router = express.Router();
const CartController = require("../controllers/CartController");

router.get("/all/:user_id", CartController.getAll)
router.post("/add", CartController.add)
router.delete("/delete", CartController.delete)

module.exports = router;


