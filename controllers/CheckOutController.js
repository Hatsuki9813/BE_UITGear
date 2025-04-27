const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Payment_method = require("../models/Payment_method");
const Product = require("../models/Product");
const MomoService = require("../services/MomoPayment");

class CheckOutController {
  async checkoutCart(req, res) {
    try {
      const { user_id, payment_name, shipping_address } = req.body;
      console.log(req.body, "req body");
      if (!user_id || !shipping_address) {
        return res.status(401).json({ message: "Missing required fields" });
      }

      const cart = await Cart.find({ user_id });
      if (!cart || cart.length === 0) {
        return res.status(402).json({ message: "Cart is empty" });
      }
      console.log(cart, "cart");
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
      console.log(orderDetails, "checkout orderDetail");
      const total_price = orderDetails.reduce((sum, item) => {
        return sum + item.quantity * item.price;
      }, 0);
      console.log(total_price);
      const order = new Order({
        user_id,
        total_price,
        order_status: "pending",
        payment_status: "pending",
        shipping_address,
        order_details: orderDetails,
      });

      const savedOrder = await order.save();
      await Cart.deleteMany({ user_id });

      let paymentResult;
      switch (payment_name) {
        case "momo":
          paymentResult = await MomoService.createPaymentRequest({
            amount: total_price,
            orderInfo: savedOrder._id.toString(),
            redirectUrl: "http://localhost:5173/ordertrack",
            ipnUrl:
              " https://72ce-14-191-60-230.ngrok-free.app/api/checkout/momo/callback",
          });
          break;
        default:
          return res
            .status(404)
            .json({ message: "Unsupported payment method" });
      }

      if (!paymentResult || paymentResult.resultCode !== 0) {
        return res
          .status(405)
          .json({ message: "Payment failed", details: paymentResult });
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

  async buyNow(req, res) {
    try {
      const {
        user_id,
        payment_id,
        payment_method,
        product_id,
        quantity,
        shipping_address,
      } = req.body;

      if (
        !user_id ||
        !payment_id ||
        !payment_method ||
        !product_id ||
        !quantity ||
        !shipping_address
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(400).json({ message: "Product not found" });
      }

      const paymentMethod = await Payment_method.findById(payment_id);
      if (!paymentMethod) {
        return res.status(400).json({ message: "Invalid payment method" });
      }

      const total_price = quantity * product.price;

      const order = new Order({
        user_id,
        total_price,
        payment_id,
        order_status: "pending",
        payment_status: "pending",
        shipping_address,
        order_details: [
          {
            product_id,
            quantity,
            price: product.price,
          },
        ],
      });

      const savedOrder = await order.save();

      let paymentResult;
      switch (payment_method) {
        case "momo":
          paymentResult = await MomoService.createPaymentRequest({
            amount: total_price,
            orderInfo: savedOrder._id.toString(),
            redirectUrl: "http://localhost:3000/api/checkout/momo/callback",
            ipnUrl:
              "https://952a-113-161-73-167.ngrok-free.app/api/checkout/momo/callback",
          });
          break;
        // Add cases for other payment methods if needed
        default:
          return res
            .status(400)
            .json({ message: "Unsupported payment method" });
      }

      if (!paymentResult || paymentResult.resultCode !== 0) {
        return res
          .status(400)
          .json({ message: "Payment failed", details: paymentResult });
      }

      const populatedOrder = await Order.findById(savedOrder._id)
        .populate("user_id", "username email")
        .populate("payment_id", "name");

      res.status(201).json({
        message: "Buy now successful",
        order: populatedOrder,
        paymentUrl: paymentResult.payUrl,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CheckOutController();
