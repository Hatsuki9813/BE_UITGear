const express = require('express');
const router = express.Router();
const ProductDetailController = require('../controllers/ProductDetailController');

router.post('/add', ProductDetailController.add);
router.get('/get/:id', ProductDetailController.get);
router.put('/update/:id', ProductDetailController.update);
router.delete('/delete/:id', ProductDetailController.delete);

module.exports = router;