const express = require('express');
const router = express.Router();
const ViewedController = require("../controllers/ViewedController");

router.get("/get", ViewedController.get)    
router.delete("/delete/:id", ViewedController.delete)
router.put("/update/:id", ViewedController.update)
router.post("/add", ViewedController.add)

module.exports = router;


