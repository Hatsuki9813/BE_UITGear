const userRouter = require("./userRouter");
const authRouter = require("./AuthRouter");
const productRouter = require("./ProductRouter");
const cartRouter = require("./CartRouter");
const orderRouter = require("./orderRouter");
const checkoutRouter = require("./CheckOutRouter");
const paymentRouter = require("./PaymentRouter");
const promotecodeRouter = require("./PromoteCodeRouter");
const questionRouter = require("./questionRouter");

function route(app) {
    app.use("/api/checkout", checkoutRouter);
    app.use("/api/promote_code", promotecodeRouter);
    app.use("/api/user", userRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/product", productRouter);
    app.use("/api/payment", paymentRouter);
    app.use("/api/cart", cartRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/question", questionRouter);
}

module.exports = route;
