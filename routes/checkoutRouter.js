const express = require("express");
const router = express.Router();
const CheckOutController = require("../controllers/CheckOutController");
const MomoService = require("../services/MomoPayment");

router.post("/", CheckOutController.checkoutCart);
router.post("/momo/callback", MomoService.momoCallBack);
router.post("/momo/transaction-status", MomoService.transactionStatus);

module.exports = router;
