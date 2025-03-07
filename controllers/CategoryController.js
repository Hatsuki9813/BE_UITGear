const Category = require('../models/Category'); // Giả sử file model ở trên là category.model.js


class CategoryController{
    async add(req, res){
        try {
            const { name, parent_category } = req.body;
            const category = new Category({
              name,
              parent_category: parent_category || null
            });
            const savedCategory = await category.save();
            res.status(201).json(savedCategory);
          } catch (error) {
            res.status(400).json({ message: error.message });
          }
        
    }
    async get(req, res){
        try {
            const categories = await Category.find()
              .populate('parent_category', 'name')
              .sort({ createdAt: -1 });
            res.status(200).json(categories);
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        
    }

    async getById(req, res){
        try {
            const category = await Category.findById(req.params.id)
              .populate('parent_category', 'name');
            if (!category) {
              return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(category);
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        
    }
    async update(req, res){
        try {
            const { name, parent_category } = req.body;
            const category = await Category.findByIdAndUpdate(
              req.params.id,
              { 
                name,
                parent_category: parent_category || null
              },
              { new: true, runValidators: true }
            );
            if (!category) {
              return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json(category);
          } catch (error) {
            res.status(400).json({ message: error.message });
          }
        
    }
    async delete(req, res){
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            if (!category) {
              return res.status(404).json({ message: 'Category not found' });
            }
            res.status(200).json({ message: 'Category deleted successfully' });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
          
    }
}



module.exports = new CategoryController();