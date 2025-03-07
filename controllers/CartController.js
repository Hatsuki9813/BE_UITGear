const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');


class CartController{
    async add(req,res){
        try {
            const { user_id, product_id, quantity } = req.body;
        
            const product = await Product.findById(product_id);
            if (!product) return res.status(404).json({ message: 'Product not found' });
        
            const total_price = product.price * quantity;
        
            let cartItem = await Cart.findOne({ user_id, product_id });
            if (cartItem) {
              cartItem.quantity += quantity;
              cartItem.total_price = product.price * cartItem.quantity;
              await cartItem.save();
            } else {
              cartItem = new Cart({ user_id, product_id, quantity, total_price });
              await cartItem.save();
            }
        
            res.status(200).json({ message: 'Product added to cart successfully', cart: cartItem });
          } catch (error) {
            res.status(500).json({ message: 'Failed to add product to cart', error: error.message });
          }
    } 
    async delete(req,res){
        try {
            const cartItem = await Cart.findByIdAndDelete(req.params.id);
            if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
        
            res.status(200).json({ message: 'Product removed from cart successfully' });
          } catch (error) {
            res.status(500).json({ message: 'Failed to remove product from cart', error: error.message });
          }
    }

    async getAll(req,res){
        try {
            const user_id = req.params.user_id;
            const cartItems = await Cart.find({ user_id }).populate('product_id');
            res.status(200).json(cartItems);
          } catch (error) {
            res.status(500).json({ message: 'Failed to fetch cart items', error: error.message });
          }
    }
}

module.exports = new CartController()