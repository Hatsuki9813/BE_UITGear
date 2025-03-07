const Brand = require("../models/Brand");

class BrandController {
  async add(req, res) {
    try {
      const { name } = req.body;
      const newBrand = new Brand({ name });
      await newBrand.save();
      res
        .status(201)
        .json({ message: "Brand added successfully", brand: newBrand });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Failed to add brand", error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const brands = await Brand.find();
      res.status(200).json({ brands });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Failed to get brands", error: error.message });
    }
  }
}

module.exports = new BrandController();
