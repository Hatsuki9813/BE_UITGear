const express = require('express');
const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.post("/add", OrderController.add)
router.get("/get", OrderController.getAll)
router.get("/get/:id", OrderController.getOrderById)
router.delete("/delete/:id", OrderController.delete)
router.put("/edit/:id", OrderController.update)

module.exports = router;


