const mongoose = require("mongoose");
require("mongoose-timestamp");

const productSchema = new mongoose.Schema(
    {
        product_id: { type: String, required: true, unique: true }, // Mã sản phẩm
        name: { type: String, required: true }, // Tên sản phẩm
        product_line: { type: String }, // Dòng sản phẩm

        description: { type: String }, // Mô tả ngắn
        description_obj: { type: Object, default: {} }, // Mô tả chi tiết

        price: { type: Number, required: true }, // Giá bán
        discount: { type: Number, default: 0 }, // Phần trăm giảm giá

        category: { type: String }, // Danh mục tên

        brand: { type: String }, // Tên thương hiệu

        specifications: { type: Object, default: {} }, // Thông số cũ (backup)
        specification_obj: { type: Object, default: {} }, // Thông số chi tiết

        review_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // ID đánh giá
        review_obj: { type: Array, default: [] }, // Chi tiết đánh giá

        image: { type: String }, // Ảnh chính
        img_obj: { type: Object, default: {} }, // Bộ ảnh đầy đủ

        stock_quantity: { type: Number, default: 0 }, // Tồn kho
        is_available: { type: Boolean, default: true }, // Có sẵn để bán
        warranty_period: { type: Number }, // Thời gian bảo hành (tháng)
    },
    { timestamps: true }
);

// Tạo index tìm kiếm theo tên và category_id
productSchema.index({ name: "text", category_id: 1 });

module.exports = mongoose.model("Product", productSchema);
