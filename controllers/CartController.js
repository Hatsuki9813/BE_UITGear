const Cart = require("../models/Cart");
const Product = require("../models/Product");

class CartController {
    async add(req, res) {
        try {
            let { user_id, product_id, quantity } = req.body;

            const product = await Product.findOne({ product_id: product_id });
            if (!product) return res.status(404).json({ message: "Product not found" });

            const total_price = product.price * quantity;
            let cartItem = await Cart.findOne({ user_id, product_id });

            if (cartItem) {
                cartItem.quantity += quantity;
                cartItem.total_price =
                    ((product.price * (100 - product.discount)) / 100) * cartItem.quantity;
                await cartItem.save();
            } else {
                cartItem = new Cart({ user_id, product_id, quantity, total_price });
                await cartItem.save();
            }

            res.status(200).json({
                message: "Product added to cart successfully",
                cart: cartItem,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to add product to cart",
                error: error.message,
            });
        }
    }

    async delete(req, res) {
        try {
            console.log(req.body, "delete cart body");
            const { user_id, product_id } = req.body;
            const cartItem = await Cart.findOneAndDelete({ user_id, product_id });
            if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

            res.status(200).json({ message: "Product removed from cart successfully" });
        } catch (error) {
            res.status(500).json({
                message: "Failed to remove product from cart",
                error: error.message,
            });
        }
    }

    async getAll(req, res) {
        try {
            const user_id = req.params.user_id;
            const cartItems = await Cart.find({ user_id });

            if (!cartItems || cartItems.length === 0) {
                return res.status(200).json(cartItems);
            }

            // Tạo 1 mảng product_id cần lấy chi tiết
            const productIds = cartItems.map((item) => item.product_id);
            const products = await Product.find({ product_id: { $in: productIds } });

            // Map sản phẩm vào từng cartItem
            const cartWithDetails = cartItems.map((cartItem) => {
                const productDetail = products.find((p) => p.product_id === cartItem.product_id);
                return {
                    ...cartItem.toObject(),
                    product_detail: productDetail || null,
                };
            });

            res.status(200).json(cartWithDetails);
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch cart items",
                error: error.message,
            });
        }
    }

    async update(req, res) {
        try {
            const { user_id, product_id, quantity } = req.body;

            const cartItem = await Cart.findOne({ user_id, product_id });
            if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

            const product = await Product.findOne({ product_id: product_id });
            if (!product) return res.status(404).json({ message: "Product not found" });

            cartItem.quantity = quantity;
            cartItem.total_price = ((product.price * (100 - product.discount)) / 100) * quantity;
            await cartItem.save();

            res.status(200).json({
                message: "Cart item updated successfully",
                cart: cartItem,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update cart item",
                error: error.message,
            });
        }
    }
}

module.exports = new CartController();
