const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.get("/:id", OrderController.getOrder);
router.put("/:orderId", OrderController.updateOrder);

module.exports = router;
