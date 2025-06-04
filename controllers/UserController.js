const User = require("../models/User");

class UserController {
    async getAllUsers(req, res) {
        try {
            let { page } = req.params;
            page = parseInt(page) || 1;
            const limit = 20;
            const skip = (page - 1) * limit;

            const users = await User.find().skip(skip).limit(limit);
            const totalUsers = await User.countDocuments();
            const totalPages = Math.ceil(totalUsers / limit);

            res.status(200).json({ users, totalUsers, totalPages, page });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getUserByQuery(req, res) {
        try {
            const { query } = req.params;

            if (!query || query.trim() === "") {
                return res.status(400).json({ message: "Query is required" });
            }

            let { page } = req.params;
            page = parseInt(page) || 1;
            const limit = 20;
            const skip = (page - 1) * limit;

            const searchRegex = new RegExp(query, "i");

            const users = await User.find({
                $or: [
                    { email: searchRegex },
                    { fullname: searchRegex },
                    { phone: searchRegex },
                    { address: searchRegex },
                ],
            })
                .skip(skip)
                .limit(limit);

            const totalUsers = users.length;
            const totalPages = Math.ceil(totalUsers / limit);

            res.status(200).json({ users, totalUsers, totalPages, page });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async updateUserByEmail(req, res) {
        try {
            const updatedUser = await User.findOneAndUpdate({ email: req.body.email }, req.body, {
                new: true,
            });
            if (!updatedUser) return res.status(404).json({ message: "User not found" });
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async deleteUserById(req, res) {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) return res.status(404).json({ message: "User not found" });
            res.status(200).json({ message: "User deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async createShippingAddress(req, res) {
        try {
            const { email, name, phone, address, isDefault } = req.body;
            console.log(
                "Creating shipping address for email:",
                email,
                name,
                phone,
                address,
                isDefault
            );

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User không tồn tại." });
            }

            if (user.shippingAddresses.length >= 5) {
                return res
                    .status(400)
                    .json({ message: "Chỉ được thêm tối đa 5 địa chỉ giao hàng." });
            }

            const usedIndexes = new Set(user.shippingAddresses.map((addr) => addr.index));
            let newIndex = 1;
            while (usedIndexes.has(newIndex) && newIndex <= 5) {
                newIndex++;
            }

            if (isDefault) {
                user.shippingAddresses.forEach((addr) => (addr.isDefault = false));
            }

            user.shippingAddresses.push({
                index: newIndex,
                name,
                phone,
                address,
                isDefault,
            });

            await user.save();
            return res
                .status(200)
                .json({ message: "Thêm địa chỉ thành công", addresses: user.shippingAddresses });
        } catch (err) {
            res.status(500).json({ error: err.message });
            console.error("Error creating shipping address:", err);
        }
    }
    async updateShippingAddress(req, res) {
        try {
            const { email, index, name, phone, address, isDefault } = req.body;

            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: "User không tồn tại." });

            const addr = user.shippingAddresses.find((addr) => addr.index === index);
            if (!addr) return res.status(404).json({ message: "Không tìm thấy địa chỉ cần sửa." });

            if (isDefault) {
                user.shippingAddresses.forEach((addr) => (addr.isDefault = false));
                addr.isDefault = true;
            } else addr.isDefault = false;

            if (name !== undefined) addr.name = name;
            if (phone !== undefined) addr.phone = phone;
            if (address !== undefined) addr.address = address;

            await user.save();
            return res.status(200).json({
                message: "Cập nhật địa chỉ thành công",
                addresses: user.shippingAddresses,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
    async deleteShippingAddress(req, res) {
        try {
            const { email, index } = req.body;
            console.log(req.body);

            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: "User không tồn tại." });

            const before = user.shippingAddresses.length;
            user.shippingAddresses = user.shippingAddresses.filter((addr) => addr.index !== index);

            if (user.shippingAddresses.length === before) {
                return res.status(404).json({ message: "Không tìm thấy địa chỉ cần xóa." });
            }

            await user.save();
            return res.status(200).json({
                message: "Xóa địa chỉ thành công",
                addresses: user.shippingAddresses,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message, message: "Lỗi khi xóa địa chỉ" });
        }
    }
}

module.exports = new UserController();
