const Order = require("../models/Order");
const Product = require("../models/Product");

class OrderController {
    getOrder = async (req, res) => {
        try {
            const { user_id } = req.params;
            const order = await Order.find({ user_id: user_id }).sort({ createdAt: -1 });
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
            return res.status(200).json(order);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    getDetailOrder = async (req, res) => {
        try {
            const { user_id, orderId } = req.params;
            console.log(user_id, orderId, "User ID and Order ID");

            const order = await Order.findOne({
                _id: orderId,
                user_id: user_id,
            });

            if (!order) {
                return res
                    .status(404)
                    .json({ message: "Order not found or does not belong to user" });
            }

            const productIds = order.order_details.map((item) => item.product_id);
            const products = await Product.find({ product_id: { $in: productIds } });

            const enrichedOrderDetails = order.order_details.map((detail) => {
                const productInfo = products.find((p) => p.product_id === detail.product_id);
                return {
                    ...detail.toObject(), // hoặc detail nếu không phải Document
                    product_info: productInfo || null,
                };
            });

            return res.status(200).json({
                order_details: enrichedOrderDetails,
                total_price: order.total_price,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    updateOrder = async (req, res) => {
        try {
            const { orderId } = req.params;
            console.log(orderId, "orderId");
            const { order_status } = req.body;
            console.log(order_status, "order_status");
            const order = await Order.findByIdAndUpdate(orderId, { order_status }, { new: true });
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
