require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const categoryRouter = require("./routes/category");
const propertyRouter = require("./routes/property");
const searchRouter = require("./routes/search");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const orderRouter = require("./routes/order");
const paymentRouter = require("./routes/payment");
const visitRouter = require("./routes/visit");
const rentalRouter = require("./routes/rental");
const { ensureDefaultCategories } = require("./utils/ensureDefaultCategories");
const { auth } = require("./middleware/auth");

const server = express();

const PORT = Number(process.env.PORT) || 8080;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/realstate";
server.use("/images", express.static(path.join(__dirname, "Images")));
server.use(cors({ origin: "*" }));
server.use(express.json());
server.use(morgan("combined"));

server.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

server.use("/category", categoryRouter.categoryRouter);
server.use("/property", propertyRouter.propertyRouter);
server.use("/search", searchRouter.searchRouter);
server.use("/auth", authRouter.router);
server.use("/users", auth, userRouter.router);
server.use("/payment", auth, paymentRouter.paymentRouter);
server.use("/visit", visitRouter.visitRouter);
server.use("/orders", auth, orderRouter.orderRouter);
server.use("/rental", rentalRouter.rentalRouter);

async function start() {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log("Connected to MongoDB");
  await ensureDefaultCategories();
  console.log("Default Kenyan categories are ready");

  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start backend:", error.message);
  process.exit(1);
});
