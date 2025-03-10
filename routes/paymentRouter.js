const express = require('express');
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");

router.get("/get/:id", PaymentController.getById)    
router.delete("/delete/:id", PaymentController.delete)
router.put("/update/:id", PaymentController.update)
router.get("/get", PaymentController.getAll)
router.post("/add", PaymentController.create)

module.exports = router;


