const Product = require("../models/Product");

class ProductController {
    async add(req, res) {
        try {
            const newProduct = new Product(req.body);
            await newProduct.save();
            res.status(201).json({ message: "Product added successfully", product: newProduct });
        } catch (error) {
            res.status(400).json({ message: "Failed to add product", error: error.message });
        }
    }
    async delete(req, res) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);
            if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            res.status(400).json({ message: "Failed to delete product", error: error.message });
        }
    }
    async edit(req, res) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
            res.status(200).json({
                message: "Product updated successfully",
                product: updatedProduct,
            });
        } catch (error) {
            res.status(400).json({ message: "Failed to update product", error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const { brand, category, product_line } = req.query; // Lấy các query params
            let { page, limit, sort, order } = req.query;
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 20;
            const skip = (page - 1) * limit;

            let sortOption = {};
            if (sort) {
                const sortField = ["name", "price"].includes(sort) ? sort : "price";
                const sortOrder = order === "asc" ? 1 : -1;
                sortOption[sortField] = sortOrder;
            }

            // Tạo điều kiện lọc linh hoạt
            const filterConditions = {};
            if (brand) filterConditions.brand = brand;
            if (category) filterConditions.category = category;
            if (product_line) filterConditions.product_line = product_line;

            // Lọc sản phẩm dựa trên điều kiện
            const products = await Product.find(filterConditions)
                .sort(sortOption)
                .skip(skip)
                .limit(limit);

            const totalProducts = await Product.countDocuments(filterConditions);
            const totalPages = Math.ceil(totalProducts / limit);

            res.json({
                page,
                totalPages,
                totalProducts,
                products,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async getBySlug(req, res) {
        try {
            let { category, brand, product_line, page, limit, sort, order } = req.query;

            page = parseInt(page) || 1;
            limit = parseInt(limit) || 20;
            const skip = (page - 1) * limit;

            let sortOption = {};
            if (sort) {
                const sortField = ["name", "price"].includes(sort) ? sort : "price";
                const sortOrder = order === "asc" ? 1 : -1;
                sortOption[sortField] = sortOrder;
            }

            // Tạo filter động
            let filter = {};
            if (category) filter.category = category;
            if (brand) filter.brand = brand;
            if (product_line) filter.product_line = product_line;

            const products = await Product.find(filter).sort(sortOption).skip(skip).limit(limit);

            const totalProducts = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);

            res.json({
                page,
                totalPages,
                totalProducts,
                products,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async search(req, res) {
        try {
            const query = req.query.q || "";
            const rcm = req.query.rcm == 1 || 0;

            if (!query) {
                return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
            }
            const searchCondition = {
                name: { $regex: query, $options: "i" },
            };

            if (rcm) {
                // Trường hợp gợi ý - giới hạn 5 kết quả
                const products = await Product.find(searchCondition).limit(5);
                return res.json(products);
            } else {
                // Trường hợp tìm kiếm đầy đủ - có phân trang
                let { page, limit, sort, order } = req.query;
                page = parseInt(page) || 1;
                limit = parseInt(limit) || 20;
                const skip = (page - 1) * limit;

                const sortOption = {};
                if (sort) {
                    const sortField = ["name", "price"].includes(sort) ? sort : "price";
                    const sortOrder = order === "asc" ? 1 : -1;
                    sortOption[sortField] = sortOrder;
                }

                const products = await Product.find(searchCondition)
                    .sort(sortOption)
                    .skip(skip)
                    .limit(limit);

                const totalProducts = await Product.countDocuments(searchCondition);
                const totalPages = Math.ceil(totalProducts / limit);

                console.log(products.map((p) => p.name));

                return res.json({
                    page,
                    totalPages,
                    totalProducts,
                    products,
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }

    async filter(req, res) {
        try {
            let { category, minPrice, maxPrice, brand, rating, page, limit } = req.query;

            page = parseInt(page) || 1; // Trang mặc định là 1
            limit = parseInt(limit) || 20;
            const skip = (page - 1) * limit; // Bỏ qua sản phẩm trước đó

            let filter = {}; // Object chứa điều kiện lọc

            // Lọc theo danh mục (category)
            if (category) {
                filter.category = category;
            }

            // Lọc theo giá (price)
            if (minPrice || maxPrice) {
                filter.price = {};
                if (minPrice) filter.price.$gte = parseFloat(minPrice); // Giá >= minPrice
                if (maxPrice) filter.price.$lte = parseFloat(maxPrice); // Giá <= maxPrice
            }

            // Lọc theo thương hiệu (brand)
            if (brand) {
                filter.brand = brand;
            }

            // Lọc theo đánh giá trung bình (rating)
            if (rating) {
                filter.rating = { $gte: parseFloat(rating) }; // Rating >= giá trị truyền vào
            }

            // Truy vấn MongoDB với các bộ lọc
            const products = await Product.find(filter).skip(skip).limit(limit);

            // Đếm tổng số sản phẩm phù hợp
            const totalProducts = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);

            res.json({
                page,
                totalPages,
                totalProducts,
                products,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            console.log(id, "id");
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
}
module.exports = new ProductController();
