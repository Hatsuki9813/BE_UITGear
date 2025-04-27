const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");

router.delete("/", CartController.delete);
router.get("/:user_id", CartController.getAll);
router.post("/add", CartController.add);

module.exports = router;
