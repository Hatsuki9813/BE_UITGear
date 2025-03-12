const Order = require('../models/Order');
const OrderDetail = require('../models/Order_detail');
const Cart = require('../models/Cart');
const Payment_method = require('../models/Payment_method');
const Product = require('../models/Product');
const MomoService = require('../services/MomoPayment');

class CheckOutController {
    async checkoutCart(req, res) {
        try {
            const { user_id, payment_id } = req.body;

            if (!user_id || !payment_id) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const cart = await Cart.find({ user_id }).populate('product_id');

            if (!cart || cart.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }

            const paymentMethod = await Payment_method.findById(payment_id);
            if (!paymentMethod) {
                return res.status(400).json({ message: 'Invalid payment method' });
            }
            const total_price = 10000;
            // const total_price = cart.reduce((total, item) => {
            //     return total + (item.quantity * item.product_id.price);
            // }, 0);

            // Tạo đơn hàng từ giỏ hàng
            const order = new Order({
                user_id,
                total_price,
                payment_id,
                order_status: 'pending',
                payment_status: 'pending',
            });

            const savedOrder = await order.save();

            const orderDetails = cart.map(item => ({
                order_id: savedOrder._id,
                product_id: item.product_id._id,
                quantity: item.quantity,
                price: item.product_id.price
            }));

            await OrderDetail.insertMany(orderDetails);

            await Cart.deleteMany({ user_id });

            // Xử lý thanh toán sau khi tạo đơn hàng
            let paymentResult;
            switch (paymentMethod.name) {
                case 'momo':
                    paymentResult = await MomoService.createPaymentRequest({
                        amount: total_price,
                        orderInfo: savedOrder._id.toString(),
                        redirectUrl: 'http://localhost:3000/api/checkout/momo/callback',
                        ipnUrl: 'https://952a-113-161-73-167.ngrok-free.app/api/checkout/momo/callback'
                    });
                    break;
                // case 'zalopay':
                //     paymentResult = await PaymentService.createZaloPayPayment(total_price, 'Order Info');
                //     break;
                // case 'vnpay':
                //     paymentResult = await PaymentService.createVNPayPayment(total_price, 'Order Info');
                //     break;
                // case 'debitcard':
                //     const cardDetails = req.body.cardDetails; // Giả sử thông tin thẻ được truyền trong body
                //     paymentResult = await PaymentService.createDebitCardPayment(cardDetails, total_price);
                //     break;
                default:
                    return res.status(400).json({ message: 'Unsupported payment method' });
            }

            if (!paymentResult || paymentResult.resultCode !== 0) {
                return res.status(400).json({ message: 'Payment failed', details: paymentResult });
            }

            const populatedOrder = await Order.findById(savedOrder._id)
                .populate('user_id', 'username email')
                .populate('payment_id', 'name');

            res.status(201).json({
                message: 'Checkout successful',
                order: populatedOrder,
                paymentUrl: paymentResult.payUrl
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async buyNow(req, res) {
        try {
            const { user_id, payment_id, payment_method, product_id, quantity } = req.body;

            if (!user_id || !payment_id || !payment_method || !product_id || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const product = await Product.findById(product_id);

            if (!product) {
                return res.status(400).json({ message: 'Product not found' });
            }

            const paymentMethod = await Payment_method.findById(payment_id);
            if (!paymentMethod) {
                return res.status(400).json({ message: 'Invalid payment method' });
            }

            const total_price = quantity * product.price;

            // Tạo đơn hàng từ thông tin mua ngay
            const order = new Order({
                user_id,
                total_price,
                payment_id,
                order_status: 'pending',
                payment_status: 'pending',
            });

            const savedOrder = await order.save();

            const orderDetail = new OrderDetail({
                order_id: savedOrder._id,
                product_id,
                quantity,
                price: product.price,
            });

            await orderDetail.save();

            // Xử lý thanh toán sau khi tạo đơn hàng
            let paymentResult;
            switch (payment_method) {
                case 'momo':
                    paymentResult = await MomoService.createPaymentRequest({
                        amount: total_price,
                        orderInfo: savedOrder._id.toString(),
                        redirectUrl: 'http://localhost:3000/api/checkout/momo/callback',
                        ipnUrl: 'https://952a-113-161-73-167.ngrok-free.app/api/checkout/momo/callback'
                    });
                    break;
                case 'zalopay':
                    paymentResult = await PaymentService.createZaloPayPayment(total_price, 'Order Info');
                    break;
                case 'vnpay':
                    paymentResult = await PaymentService.createVNPayPayment(total_price, 'Order Info');
                    break;
                case 'debitcard':
                    const cardDetails = req.body.cardDetails; // Giả sử thông tin thẻ được truyền trong body
                    paymentResult = await PaymentService.createDebitCardPayment(cardDetails, total_price);
                    break;
                default:
                    return res.status(400).json({ message: 'Unsupported payment method' });
            }

            if (!paymentResult || paymentResult.resultCode !== 0) {
                return res.status(400).json({ message: 'Payment failed', details: paymentResult });
            }

            const populatedOrder = await Order.findById(savedOrder._id)
                .populate('user_id', 'username email')
                .populate('payment_id', 'method_name');

            res.status(201).json({
                message: 'Buy now successful',
                order: populatedOrder,
                paymentUrl: paymentResult.payUrl
            });

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CheckOutController();