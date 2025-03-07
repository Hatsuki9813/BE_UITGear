const mongoose = require('mongoose');
require('mongoose-timestamp');

const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
},{timestamps:true});

// Tạo index cho user_id và product_id
reviewSchema.index({ user_id: 1, product_id: 1 });

module.exports = mongoose.model('Review', reviewSchema);