const userRouter = require("./UserRouter");
const authRouter = require("./AuthRouter");
const productRouter = require("./ProductRouter");
const cartRouter = require("./CartRouter");
const brandRouter = require("./BrandRouter");
const categoryRouter = require("./CategoryRouter");
const orderRouter = require("./OrderRouter");
const checkoutRouter = require("./CheckOutRouter");
const paymentRouter = require("./PaymentRouter");
const viewedRouter = require("./ViewedRouter");
const promotecodeRouter = require("./PromoteCodeRouter");

function route(app) {
  app.use("/api/checkout", checkoutRouter);
  app.use("/api/viewed", viewedRouter);
  app.use("/api/promote_code", promotecodeRouter);
  app.use("/api/user", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/product", productRouter);
  app.use("/api/payment", paymentRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/brand", brandRouter);
  app.use("/api/category", categoryRouter);
  app.use("/api/order", orderRouter);
  // app.use("/api/cart",cartRouter)
  // app.use("/api/viewed",viewedRouter)
  // app.use("/api/favourite",favouriteRouter)
  // app.use("/api/checkout",checkOutRouter)
  // app.use("/api/upload",upload)
}

module.exports = route;
