const mongoose = require("mongoose");
require("mongoose-timestamp");

const paymentMethodSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        is_active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Tạo index cho name
paymentMethodSchema.index({ name: 1 });

module.exports = mongoose.model("Payment_method", paymentMethodSchema);
