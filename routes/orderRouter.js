const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.get("/:user_id", OrderController.getOrder);
router.put("/:orderId", OrderController.updateOrder);
router.get("/:user_id/:orderId", OrderController.getDetailOrder);

module.exports = router;
