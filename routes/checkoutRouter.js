const express = require('express');
const router = express.Router();
const CheckOutController = require("../controllers/CheckOutController");

router.post("/checkout", CheckOutController.checkoutCart)
router.post("/buynow", CheckOutController.buyNow)

module.exports = router;


