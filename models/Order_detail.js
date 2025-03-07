const mongoose = require('mongoose');
require('mongoose-timestamp');

const orderDetailSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
},{timestamps:true});

// Tạo index cho order_id và product_id
orderDetailSchema.index({ order_id: 1, product_id: 1 });

module.exports = mongoose.model('Order_detail', orderDetailSchema);