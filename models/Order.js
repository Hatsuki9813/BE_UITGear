const mongoose = require("mongoose");
require("mongoose-timestamp");

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        order_status: {
            type: String,
            default: "Đang chờ",
            enum: ["Đang chờ", "Đang xử lý", "Đang giao", "Đã giao", "Bị huỷ"],
        },
        shipping_address: {
            name: { type: String },
            phone: { type: String },
            address: { type: String },
            note: { type: String },
            email: { type: String },
        },
        payment_status: { type: String, default: "false" },
        checkout_id: { type: String, default: "" },
        total_price: { type: Number, required: true },
        payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payment_method" },
        order_details: [
            {
                product_id: {
                    type: String,
                    required: true,
                },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true },
            },
        ],
    },
    { timestamps: true }
);

// Tạo index cho user_id
orderSchema.index({ user_id: 1 });

module.exports = mongoose.model("Order", orderSchema);
