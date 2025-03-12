const View = require("../models/Viewed");
const Product = require("../models/Product");
class ViewController {
  async add(req, res) {
    try {
      const { user_id, product_id } = req.body;
      const have_product = Product.findById({product_id});
      if(have_product) return res.status(201).json("Sản phẩm đã được thêm");
  
      const view = new View({
        user_id,
        product_id,
      });
      
      const savedview = await view.save();
      res.status(201).json(savedview);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async get(req, res) {
    try {
      const { user_id } = req.body;
      const view = await View.find({ user_id: user_id });
      if (!view) {
        return res.status(404).json({ message: 'View not found' });
      }
      res.status(200).json(view);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { user_id, productid } = req.body;
      const view = await View.findByIdAndUpdate(
        req.params.id,
        {
          user_id,
          productid
        },
        { new: true, runValidators: true }
      );
      if (!view) {
        return res.status(404).json({ message: 'View not found' });
      }
      res.status(200).json(view);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const view = await View.findById(req.params.id);
      if (!view) {
        return res.status(404).json({ message: 'View not found' });
      }
      await view.deleteOne();
      res.status(200).json({ message: 'View deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ViewController();