const Order = require("../models/Order");
const Order_detail = require("../models/Order_detail");

class OrderController {
  async add(req, res) {
    try{
    const { user_id, total_price, payment_id, order_status } = req.body;
    const order = new Order({
      user_id,
      total_price,
      payment_id,
      order_status: order_status || "pending",
    });
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  }
  catch(error) {
    res.status(400).json({ message: error.message });
  }}

  async getAll(req, res) {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  }

  async getOrderById(req, res) {
    try {
        const order = await Order.findById(req.params.id)
          .populate('user_id', 'username email')
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  }

  async update(req, res) {
    try {
        const { user_id, order_status, total_price, payment_id } = req.body;
        const order = await Order.findByIdAndUpdate(
          req.params.id,
          {
            user_id,
            order_status,
            total_price,
            payment_id
          },
          { new: true, runValidators: true }
        );
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
  }

  async delete(req, res) {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        // Xóa tất cả order details liên quan trước
        await Order_detail.deleteMany({ order_id: order._id });
        await order.deleteOne();
        res.status(200).json({ message: 'Order and related details deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  }
}

module.exports = new OrderController();
