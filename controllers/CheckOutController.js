// checkout.controller.js
const Order = require('../models/Order');
const OrderDetail = require('../models/Order_detail');
const Cart = require('../models/Cart'); // Nếu có
const Payment_method = require('../models/Payment_method'); // Nếu có
const Product = require('../models/Product');


class CheckOutController {
    async checkoutCart(req,res) {
        try {
          const {user_id, payment_id} = req.body;
          const cart = await Cart.find({ user_id }).populate('product_id');

          if (!cart || cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
          }
          
          const total_price = cart.reduce((total, item) => {
            return total + (item.quantity * item.total_price); // Dùng total_price của từng item
          }, 0);
          
          const order = new Order({
            user_id,
            total_price,
            payment_id,
            order_status: 'pending'
          });
          const savedOrder = await order.save();
          
          const orderDetails = cart.map(item => ({
            order_id: savedOrder._id,
            product_id: item.product_id._id,
            quantity: item.quantity,
            price: item.total_price
          }));
          
          await OrderDetail.insertMany(orderDetails);
          
          // Xóa giỏ hàng sau khi checkout (nếu muốn)
          await Cart.deleteMany({ user_id });
          
          const populatedOrder = await Order.findById(savedOrder._id)
            .populate('user_id', 'username email')
            .populate('payment_id', 'name');
          
          res.status(201).json({
            message: 'Checkout successful',
            order: populatedOrder
          });          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        
    }

    async buyNow(req,res) {
        try {
            const { user_id, payment_id, product_id, quantity } = req.body;
        
            if (!product_id || !quantity) {
              return res.status(400).json({ message: 'Missing required fields' });
            }
            
            const product = await Product.findById(product_id)
            const total_price = quantity * product.price;
        
            const order = new Order({
              user_id,
              total_price,
              payment_id,
              order_status: 'pending'
            });
            const savedOrder = await order.save();
        
            const orderDetail = new OrderDetail({
              order_id: savedOrder._id,
              product_id,
              quantity,
              price: total_price,
            });
            await orderDetail.save();
        
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

