const express = require('express');
const router = express.Router();
const PromoCodeController = require('../controllers/PromoteCodeController');

router.post('/promo-codes', PromoCodeController.add);
router.get('/promo-codes/:id', PromoCodeController.get);
router.put('/promo-codes/:id', PromoCodeController.update);
router.delete('/promo-codes/:id', PromoCodeController.delete);

module.exports = router;