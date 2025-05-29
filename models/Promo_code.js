const mongoose = require("mongoose");
require("mongoose-timestamp");
const promoCodeSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        value: { type: Number, required: true }, // Giá trị giảm giá (% hoặc số tiền)
        valid_date: { type: Date, required: true },
    },
    { timestamps: true }
);

// Tạo index cho code
module.exports = mongoose.model("Promo_code", promoCodeSchema);
