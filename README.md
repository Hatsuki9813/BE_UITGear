# 🚀 UITGear Backend

*Một RESTful API cho trang web bán laptop và phụ kiện, hỗ trợ quản lý sản phẩm, giỏ hàng, đặt hàng, và đánh giá sản phẩm.*

---

## 📚 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Cài đặt](#-cài-đặt)
- [Cách sử dụng](#-cách-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Đóng góp](#-đóng-góp)
- [Liên hệ](#-liên-hệ)

---

## 🌟 Giới thiệu

**UITGear** là một RESTful API được xây dựng nhằm hỗ trợ các tính năng cần thiết cho một trang web thương mại điện tử bán laptop và phụ kiện. Dự án cung cấp các chức năng quản lý sản phẩm, giỏ hàng, đơn hàng và đánh giá sản phẩm.

---

## ✨ Tính năng

Dự án bao gồm các tính năng chính sau:

- ✅ Quản lý sản phẩm (CRUD)
- ✅ Xác thực người dùng (JWT, Google OAuth)
- ✅ Hỗ trợ giỏ hàng và thanh toán
- ✅ Đánh giá và bình luận sản phẩm
- ✅ API RESTful

---

## 🛠️ Cài đặt

Hướng dẫn chi tiết cách cài đặt và chạy dự án:

### 1. Clone repo
```bash
git clone https://github.com/thoangne/UITGear-backend.git
cd UITGear-backend
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` và thêm các giá trị:
```plaintext
PORT=3000
MONGO_URI=your-mongo-uri
JWT_SECRET=your-secret-key
```

### 4. Chạy project
```bash
npm start
```

---

## 🚀 Cách sử dụng

Ví dụ về cách sử dụng các API chính:

- **Lấy danh sách sản phẩm**
  ```http
  GET /api/products
  ```

- **Thêm sản phẩm vào giỏ hàng**
  ```http
  POST /api/cart
  ```

---

## 📂 Cấu trúc thư mục

Giải thích nhanh về các thư mục chính trong dự án:

```
/src
│-- /config          # Cấu hình môi trường, database
│-- /controllers     # Xử lý logic nghiệp vụ
│-- /models          # Mô hình dữ liệu (MongoDB)
│-- /routes          # Định tuyến API
│-- /utils           # Các hàm tiện ích
│-- app.js        # Điểm khởi đầu của app
.env                 # Biến môi trường
README.md            # Tài liệu dự án
```

---

## 🤝 Đóng góp

Nếu bạn muốn đóng góp cho dự án, hãy làm theo các bước sau:

1. **Fork dự án**
2. **Tạo nhánh mới**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Commit thay đổi**
   ```bash
   git commit -m 'Thêm tính năng mới'
   ```
4. **Push lên nhánh mới**
   ```bash
   git push origin feature/new-feature
   ```
5. **Tạo Pull Request**

---

## 📞 Liên hệ

Nếu có thắc mắc hoặc góp ý, vui lòng liên hệ:

- 📧 Email: [nguythoang2003@gmail.com](mailto:nguythoang2003@gmail.com)


