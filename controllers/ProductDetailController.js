const ProductSpecification = require("../models/Product_Specification");

class ProductDetailController {
  async add(req, res) {
    try {
      const { specifications } = req.body;
      const productSpecification = new ProductSpecification({
        specifications,
      });
      const savedProductSpecification = await productSpecification.save();
      res.status(201).json(savedProductSpecification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async get(req, res) {
    try {
      const productSpecification = await ProductSpecification.findById(req.params.id);
      if (!productSpecification) {
        return res.status(404).json({ message: 'Product Specification not found' });
      }
      res.status(200).json(productSpecification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { specifications } = req.body;
      const productSpecification = await ProductSpecification.findByIdAndUpdate(
        req.params.id,
        { specifications },
        { new: true, runValidators: true }
      );
      if (!productSpecification) {
        return res.status(404).json({ message: 'Product Specification not found' });
      }
      res.status(200).json(productSpecification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const productSpecification = await ProductSpecification.findById(req.params.id);
      if (!productSpecification) {
        return res.status(404).json({ message: 'Product Specification not found' });
      }
      await productSpecification.deleteOne();
      res.status(200).json({ message: 'Product Specification deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductDetailController();