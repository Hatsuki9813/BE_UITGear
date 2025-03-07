const express = require('express');
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

router.post("/add", CategoryController.add)
router.get("/get", CategoryController.get)
router.get("/get/:id", CategoryController.getById)
router.delete("/delete/:id", CategoryController.delete)
router.put("/update/:id", CategoryController.update)

module.exports = router;


