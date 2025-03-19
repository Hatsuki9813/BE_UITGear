const express = require('express');
const router = express.Router();
const ProductController = require("../controllers/ProductController");

router.get("/", ProductController.getAll)
router.get("/filter", ProductController.filter)
router.post("/add", ProductController.add)
router.delete("/delete/:id", ProductController.delete)
router.put("/edit/:id", ProductController.edit)
router.get("/search", ProductController.search)

module.exports = router;


