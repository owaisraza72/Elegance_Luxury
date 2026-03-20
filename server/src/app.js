const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const cors = require("cors");
const { authRouter } = require("./router/auth");
const { productRouter } = require("./router/product");
const { adminRouter } = require("./router/admin");
const { orderRouter } = require("./router/order");
const { authMiddleware } = require("./middleware/auth");
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/admin", adminRouter);
app.use("/orders", orderRouter);

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed", err);
  });
