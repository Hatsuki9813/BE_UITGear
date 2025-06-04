const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Payment_method = require("../models/Payment_method");
const MomoService = require("../services/MomoPayment");
const dotenv = require("dotenv");
dotenv.config();

class CheckOutController {
    async checkoutCart(req, res) {
        try {
            const { user_id, payment_name, shipping_address, pr } = req.body;
            if (!user_id || !shipping_address) {
                return res.status(401).json({ message: "Missing required fields" });
            }

            const cart = await Cart.find({ user_id });
            if (!cart || cart.length === 0) {
                return res.status(402).json({ message: "Cart is empty" });
            }

            const paymentMethod = await Payment_method.findOne({
                name: payment_name,
            });

            if (!paymentMethod) {
                return res.status(403).json({ message: "Invalid payment method" });
            }

            const orderDetails = cart.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.total_price,
            }));

            const total_price = pr;
            if (typeof total_price !== "number" || total_price <= 0) {
                return res.status(406).json({ message: "Invalid total price" });
            }

            const order = new Order({
                user_id: user_id,
                total_price,
                order_status: "Đang chờ",
                payment_status: "Đang chờ",
                shipping_address,
                order_details: orderDetails,
            });

            const savedOrder = await order.save();

            let paymentResult;
            switch (payment_name) {
                case "momo":
                    paymentResult = await MomoService.createPaymentRequest({
                        amount: total_price,
                        orderInfo: savedOrder._id.toString(),
                        redirectUrl: "http://localhost:5173/ordertrack",
                        ipnUrl: process.env.PUBLIC_HOST + "/api/checkout/momo/callback",
                        userId: user_id,
                    });
                    break;
                default:
                    return res.status(404).json({ message: "Unsupported payment method" });
            }

            if (!paymentResult || paymentResult.resultCode !== 0) {
                return res.status(405).json({ message: "Payment failed", details: paymentResult });
            }

            const populatedOrder = await Order.findById(savedOrder._id)
                .populate("user_id", "username email")
                .populate("payment_id", "name");

            res.status(201).json({
                message: "Checkout successful",
                order: populatedOrder,
                paymentUrl: paymentResult.payUrl,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CheckOutController();
