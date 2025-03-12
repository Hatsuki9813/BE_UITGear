const PromoCode = require("../models/Promo_code");

class PromoCodeController {
  async add(req, res) {
    try {
      const { code, value, valid_date } = req.body;
      const promoCode = new PromoCode({
        code,
        value,
        valid_date,
      });
      const savedPromoCode = await promoCode.save();
      res.status(201).json(savedPromoCode);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async get(req, res) {
    try {
      const promoCode = await PromoCode.findById(req.params.id);
      if (!promoCode) {
        return res.status(404).json({ message: 'Promo Code not found' });
      }
      res.status(200).json(promoCode);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { code, value, valid_date } = req.body;
      const promoCode = await PromoCode.findByIdAndUpdate(
        req.params.id,
        {
          code,
          value,
          valid_date
        },
        { new: true, runValidators: true }
      );
      if (!promoCode) {
        return res.status(404).json({ message: 'Promo Code not found' });
      }
      res.status(200).json(promoCode);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const promoCode = await PromoCode.findById(req.params.id);
      if (!promoCode) {
        return res.status(404).json({ message: 'Promo Code not found' });
      }
      await promoCode.deleteOne();
      res.status(200).json({ message: 'Promo Code deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new PromoCodeController();