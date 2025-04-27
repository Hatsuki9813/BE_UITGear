const Order = require("../models/Order");

class OrderController {
  async getOrder(req, res) {
    try {
      const { user_id } = req.params;
      console.log(req.params);
      const order = await Order.find(user_id);
      console.log(order);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  updateOrder = async (req, res) => {
    try {
      const { orderId } = req.params;
      console.log(orderId, "orderId");
      const { order_status } = req.body;
      console.log(order_status, "order_status");
      const order = await Order.findByIdAndUpdate(
        orderId,
        { order_status },
        { new: true }
      );
      console.log(order, "order");
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      return res.status(200).json(order);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
module.exports = new OrderController();
