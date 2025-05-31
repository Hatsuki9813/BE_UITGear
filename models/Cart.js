const mongoose = require("mongoose");
require("mongoose-timestamp");

const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product_id: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        total_price: { type: Number, required: true },
    },
    { timestamps: true }
);

// Tạo index cho user_id và product_id
cartSchema.index({ user_id: 1, product_id: 1 });

module.exports = mongoose.model("Cart", cartSchema);
