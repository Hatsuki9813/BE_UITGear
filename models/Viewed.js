const mongoose = require('mongoose');
require('mongoose-timestamp');

const viewedSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
},{timestamps:true});

// Tạo index cho user_id và product_id
viewedSchema.index({ user_id: 1, product_id: 1 });

module.exports = mongoose.model('Viewed', viewedSchema);