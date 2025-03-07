const userRouter = require("./userRouter");
const authRouter = require("./authRouter");
const productRouter = require("./productRouter");
const cartRouter = require("./cartRouter");
const brandRouter = require("./brandRouter");
const categoryRouter = require("./categoryRouter");
const orderRouter = require("./orderRouter");
const orderdetailRouter = require("./orderdetailRouter");
const checkoutRouter = require("./checkoutRouter");

function route(app){
    app.use("/api/checkout",checkoutRouter)
    app.use("/api/user",userRouter)
    app.use("/api/auth",authRouter)
    app.use("/api/product",productRouter)
    app.use("/api/cart",cartRouter)
    app.use("/api/brand",brandRouter)
    app.use("/api/category",categoryRouter)
    app.use("/api/order",orderRouter)
    app.use("/api/order_detail",orderdetailRouter)
    // app.use("/api/cart",cartRouter)
    // app.use("/api/viewed",viewedRouter)
    // app.use("/api/favourite",favouriteRouter)
    // app.use("/api/checkout",checkOutRouter)
    // app.use("/api/upload",upload)
}

module.exports = route;
