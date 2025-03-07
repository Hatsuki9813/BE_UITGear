// orderDetail.controller.js
const OrderDetail = require('../models/Order_detail');


class OrderDetailController{
    async add(req,res){
        try {
            const { order_id, product_id, quantity, price } = req.body;
            const orderDetail = new OrderDetail({
              order_id,
              product_id,
              quantity,
              price
            });
            const savedOrderDetail = await orderDetail.save();
            res.status(201).json(savedOrderDetail);
          } catch (error) {
            res.status(400).json({ message: error.message });
          }
        
    }

    async getAll(req,res){
    try{
        const orderDetails = await OrderDetail.find()
        .populate('order_id', 'order_status total_price')
        .populate('product_id', 'name price')
        .sort({ createdAt: -1 });
      res.status(200).json(orderDetails);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }}
    
    async getById(req,res){
        try {
            const orderDetail = await OrderDetail.findById(req.params.id)
              .populate('order_id', 'order_status total_price')
              .populate('product_id', 'name price');
            if (!orderDetail) {
              return res.status(404).json({ message: 'Order detail not found' });
            }
            res.status(200).json(orderDetail);
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        
    }
    async update(req,res){
        try {
            const { order_id, product_id, quantity, price } = req.body;
            const orderDetail = await OrderDetail.findByIdAndUpdate(
              req.params.id,
              {
                order_id,
                product_id,
                quantity,
                price
              },
              { new: true, runValidators: true }
            );
            if (!orderDetail) {
              return res.status(404).json({ message: 'Order detail not found' });
            }
            res.status(200).json(orderDetail);
          } catch (error) {
            res.status(400).json({ message: error.message });
          }
        
    }
    async delete(req,res){
        try {
            const orderDetail = await OrderDetail.findByIdAndDelete(req.params.id);
            if (!orderDetail) {
              return res.status(404).json({ message: 'Order detail not found' });
            }
            res.status(200).json({ message: 'Order detail deleted successfully' });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
        
    } 
}

module.exports = new OrderDetailController();

