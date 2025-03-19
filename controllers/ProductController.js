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
      let { page, limit } = req.query;

      page = parseInt(page) || 1; 
      limit = parseInt(limit) || 20; 
      const skip = (page - 1) * limit; 

      const products = await Product.find()
          .skip(skip) 
          .limit(limit) 

      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);

      res.json({
          page,
          totalPages,
          totalProducts,
          products
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
  }
  }

  async search(req,res) {
    try {
      const query = req.query.q || ''; 
      if (!query) {
          return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
      }
      const products = await Product.find({
          name: { $regex: query, $options: 'i' }
      });

      res.json(products);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
  }
  }

  async filter(req,res) {
    try {
      let { category, minPrice, maxPrice, brand, rating, page, limit } = req.query;

      page = parseInt(page) || 1; // Trang mặc định là 1
      limit = parseInt(limit) || 20; 
      const skip = (page - 1) * limit; // Bỏ qua sản phẩm trước đó

      let filter = {}; // Object chứa điều kiện lọc

      // Lọc theo danh mục (category)
      if (category) {
          filter.category = category;
      }

      // Lọc theo giá (price)
      if (minPrice || maxPrice) {
          filter.price = {};
          if (minPrice) filter.price.$gte = parseFloat(minPrice); // Giá >= minPrice
          if (maxPrice) filter.price.$lte = parseFloat(maxPrice); // Giá <= maxPrice
      }

      // Lọc theo thương hiệu (brand)
      if (brand) {
          filter.brand = brand;
      }

      // Lọc theo đánh giá trung bình (rating)
      if (rating) {
          filter.rating = { $gte: parseFloat(rating) }; // Rating >= giá trị truyền vào
      }

      // Truy vấn MongoDB với các bộ lọc
      const products = await Product.find(filter)
          .skip(skip)
          .limit(limit);

      // Đếm tổng số sản phẩm phù hợp
      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      res.json({
          page,
          totalPages,
          totalProducts,
          products
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server" });
  }
  }
}
module.exports = new ProductController()
