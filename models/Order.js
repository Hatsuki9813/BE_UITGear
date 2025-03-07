const mongoose = require('mongoose');
require('mongoose-timestamp');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order_status: { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
  total_price: { type: Number, required: true },
  payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment_method' },
},{timestamps:true});

// Tạo index cho user_id
orderSchema.index({ user_id: 1 });

module.exports = mongoose.model('Order', orderSchema);