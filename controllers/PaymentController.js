const PaymentMethod = require("../models/Payment_method");

class PaymentMethodController {
    // Lấy tất cả phương thức thanh toán
    async getAll(req, res) {
        try {
            console.log(req.params.id);
            const paymentMethods = await PaymentMethod.find();
            res.status(200).json(paymentMethods);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy phương thức thanh toán theo ID
    async getById(req, res) {
        try {
            const paymentMethod = await PaymentMethod.findById(req.params.id);

            if (!paymentMethod) {
                return res.status(404).json({ message: "Payment method not found" });
            }
            res.status(200).json(paymentMethod);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Tạo mới phương thức thanh toán
    async create(req, res) {
        const { name } = req.body;
        try {
            const newPaymentMethod = new PaymentMethod({ name });
            await newPaymentMethod.save();
            res.status(201).json(newPaymentMethod);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Cập nhật phương thức thanh toán
    async update(req, res) {
        try {
            const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedPaymentMethod) {
                return res.status(404).json({ message: "Payment method not found" });
            }
            res.status(200).json(updatedPaymentMethod);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Xóa phương thức thanh toán
    async delete(req, res) {
        try {
            const deletedPaymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);
            if (!deletedPaymentMethod) {
                return res.status(404).json({ message: "Payment method not found" });
            }
            res.status(200).json({ message: "Payment method deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new PaymentMethodController();
