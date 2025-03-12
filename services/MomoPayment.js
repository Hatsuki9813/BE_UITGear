const crypto = require("crypto");
const axios = require("axios");
const Order = require("../models/Order");


class MomoService {
  static async createPaymentRequest({
    amount,
    orderInfo,
    redirectUrl,
    ipnUrl,
  }) {
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const requestType = "captureWallet";
    const extraData = "";

    // Kiểm tra các trường bắt buộc
    if (!amount || !orderInfo || !redirectUrl || !ipnUrl) {
      throw new Error("Missing required fields");
    }

    // Ký HMAC SHA256
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    // Tạo request body
    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    try {
      // Gửi yêu cầu tới MoMo
      const response = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/create",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo yêu cầu thanh toán MoMo:", error.message);
      if (error.response) {
        console.error("Chi tiết lỗi từ MoMo:", error.response.data);
      }
      throw error;
    }
  }

  static async momoCallBack(req, res) {
    console.log("Received Callback:", req.query); // Log thông tin chi tiết callback
    const { orderInfo, resultCode, message } = req.query;
    console.log("orderInfo: ", orderInfo);
    if (resultCode === "0") {
      const order = await Order.findById(orderInfo);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      order.payment_status = message;
      await order.save();
      return res.status(200).json({ message: message });
    } else {
      return res.status(400).json({ message: message });
    }
  }

  static async transactionStatus(req, res) {
    const { orderId } = req.query;
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const requestId = partnerCode + new Date().getTime();
    const requestType = "transactionStatus";

    // Tạo chữ ký
    const rawSignature = `partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${requestId}&orderId=${orderId}&requestType=${requestType}`;
    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    // Gọi API để lấy trạng thái giao dịch từ MoMo
    try {
      const response = await axios.get(
        `https://test-payment.momo.vn/v2/gateway/api/pay/query-status?partnerCode=${partnerCode}&accessKey=${accessKey}&requestId=${requestId}&orderId=${orderId}&requestType=${requestType}&signature=${computedSignature}`
      );

      return res.status(200).json(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy trạng thái giao dịch từ MoMo:", error.message);
      if (error.response) {
        console.error("Chi tiết lỗi từ MoMo:", error.response.data);
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = MomoService;
