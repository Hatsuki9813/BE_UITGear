// checkout.controller.js
const Order = require('../models/Order');
const OrderDetail = require('../models/Order_detail');
const Cart = require('../models/Cart'); // Nếu có


class CheckOutController {
    async checkoutCart(req,res) {
        try {
            const { user_id, payment_id } = req.body;
        
            // Lấy giỏ hàng của user
            const cart = await Cart.findOne({ user_id }).populate('items.product_id');
            if (!cart || cart.items.length === 0) {
              return res.status(400).json({ message: 'Cart is empty' });
            }
        
            // Tính tổng tiền
            const total_price = cart.items.reduce((total, item) => {
              return total + (item.quantity * item.price);
            }, 0);
        
            // Tạo order mới
            const order = new Order({
              user_id,
              total_price,
              payment_id,
              order_status: 'pending'
            });
            const savedOrder = await order.save();
        
            // Tạo order details
            const orderDetails = cart.items.map(item => ({
              order_id: savedOrder._id,
              product_id: item.product_id._id,
              quantity: item.quantity,
              price: item.price
            }));
            await OrderDetail.insertMany(orderDetails);
        
            // Xóa giỏ hàng sau khi thanh toán (nếu cần)
            await Cart.findOneAndDelete({ user_id });
        
            // Trả về thông tin order
            const populatedOrder = await Order.findById(savedOrder._id)
              .populate('user_id', 'username email')
              .populate('payment_id', 'method_name');
            res.status(201).json({
              message: 'Checkout successful',
              order: populatedOrder
            });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        
    }

    async buyNow(req,res) {
        try {
            const { user_id, payment_id, product_id, quantity, price } = req.body;
        
            if (!product_id || !quantity || !price) {
              return res.status(400).json({ message: 'Missing required fields' });
            }
        
            // Tính tổng tiền
            const total_price = quantity * price;
        
            // Tạo order mới
            const order = new Order({
              user_id,
              total_price,
              payment_id,
              order_status: 'pending'
            });
            const savedOrder = await order.save();
        
            // Tạo order detail
            const orderDetail = new OrderDetail({
              order_id: savedOrder._id,
              product_id,
              quantity,
              price
            });
            await orderDetail.save();
        
            // Trả về thông tin order
            const populatedOrder = await Order.findById(savedOrder._id)
              .populate('user_id', 'username email')
              .populate('payment_id', 'method_name');
            res.status(201).json({
              message: 'Buy now successful',
              order: populatedOrder
            });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
      
    }
}
module.exports = new CheckOutController();

