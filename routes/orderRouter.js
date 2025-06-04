const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.get("/:user_id", OrderController.getOrder);
router.get("/query/:query/:page", OrderController.queryOrder);
router.put("/:orderId", OrderController.updateOrderStatus);
router.get("/:user_id/:orderId", OrderController.getDetailOrder);

module.exports = router;
