const mongoose = require("mongoose");

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

    queryOrder = async (req, res) => {
        try {
            const { query } = req.params;
            const limit = 20;
            const page = parseInt(req.params.page) || 1;
            const skip = (Number(page) - 1) * limit;

            let objectIdQuery = null;
            if (mongoose.Types.ObjectId.isValid(query)) {
                objectIdQuery = new mongoose.Types.ObjectId(String(query));
            }

            const orders = await Order.find({
                $or: [
                    ...(objectIdQuery ? [{ _id: objectIdQuery }] : []),
                    { "shipping_address.name": { $regex: query, $options: "i" } },
                    { "shipping_address.phone": { $regex: query, $options: "i" } },
                    { "shipping_address.address": { $regex: query, $options: "i" } },
                    { "shipping_address.note": { $regex: query, $options: "i" } },
                    { "shipping_address.email": { $regex: query, $options: "i" } },
                    { payment_status: { $regex: query } },
                ],
            })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            console.log(orders, "Orders found");

            const totalOrders = orders.length;

            const totalPages = Math.ceil(totalOrders / limit);

            return res.status(200).json({
                orders,
                page,
                totalPages,
                totalOrders,
            });
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

    updateOrderStatus = async (req, res) => {
        try {
            const { orderId } = req.params;
            const { order_status } = req.body;
            const order = await Order.findByIdAndUpdate(orderId, { order_status }, { new: true });

            if (!order) return res.status(404).json({ message: "Order not found" });

            return res.status(200).json(order);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
}
module.exports = new OrderController();
