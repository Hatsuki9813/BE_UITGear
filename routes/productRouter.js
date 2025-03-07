const express = require('express');
const router = express.Router();
const ProductController = require("../controllers/ProductController");

router.post("/add", ProductController.add)
router.delete("/delete/:id", ProductController.delete)
router.put("/edit/:id", ProductController.edit)
router.get("/all", ProductController.getAll)

module.exports = router;


