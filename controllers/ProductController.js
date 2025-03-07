const Product = require('../models/Product')

class ProductController {
  async add(req,res) {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
      res.status(400).json({ message: 'Failed to add product', error: error.message });
    }
  }

  async delete(req,res) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete product', error: error.message });
    }
  }
  async edit(req,res) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
      res.status(400).json({ message: 'Failed to update product', error: error.message });
    }
  }

  async getAll(req,res) {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
  }
}
module.exports = new ProductController()
