const express = require('express');
const router = express.Router();
const BrandController = require("../controllers/BrandController");

// router.put("/edit/:id", BrandController.edit)
router.post("/add", BrandController.add)
// router.delete("/delete/:id", BrandController.delete)
router.get("/all", BrandController.getAll)

module.exports = router;


