const express = require("express");
const router = express.Router();
const CartController = require("../controllers/CartController");

router.delete("/", CartController.delete);
router.post("/add", CartController.add);
router.put("/update", CartController.update);
router.get("/:user_id", CartController.getAll);

module.exports = router;
