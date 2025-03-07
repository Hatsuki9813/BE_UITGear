const mongoose = require('mongoose');
require('mongoose-timestamp');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  specifications_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_Specification' },
  review_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  image: { type: String }, 
  stock_quantity: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }, 
  is_available: { type: Boolean, default: true },
  warranty_period: { type: Number }, 
},{timestamps:true});

// Tạo index cho name và category_id
productSchema.index({ name: 'text', category_id: 1 });

module.exports = mongoose.model('Product', productSchema);