const express = require("express");
const orderRouter = express.Router();
const { Order } = require("../model/order");
const {
  authMiddleware,
  adminMiddleware,
  sellerMiddleware,
} = require("../middleware/auth");
const { clearCart } = require("../controller/cartController");
const { Product } = require("../model/product");

/* ================= CREATE ORDER ================= */
orderRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
    });

    await order.save();
    await clearCart(req.user._id);
    res.status(201).send({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/* ================= GET USER ORDERS ================= */
orderRouter.get("/myOrders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name imageUrl price")
      .sort({ createdAt: -1 });
    res.status(200).send({ orders });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/* ================= GET ALL ORDERS (ADMIN) ================= */
orderRouter.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "name email")
        .populate("items.product", "name imageUrl price")
        .sort({ createdAt: -1 });
      res.status(200).send({ orders });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
);

/* ================= GET SELLER ORDERS ================= */
orderRouter.get(
  "/seller/all",
  authMiddleware,
  sellerMiddleware,
  async (req, res) => {
    try {
      // Find products owned by this seller
      const sellerProducts = await Product.find({ seller: req.user._id });
      const productIds = sellerProducts.map((p) => p._id);

      // Find orders that contain any of these products
      const orders = await Order.find({
        "items.product": { $in: productIds },
      })
        .populate("user", "name email")
        .populate("items.product", "name imageUrl price seller")
        .sort({ createdAt: -1 });

      res.status(200).send({ orders });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
);

/* ================= UPDATE ORDER STATUS ================= */
orderRouter.patch(
  "/status/:id",
  authMiddleware,
  sellerMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true },
      );

      if (!order) return res.status(404).send({ message: "Order not found" });

      res.status(200).send({ message: "Order status updated", order });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
);

/* ================= GET SINGLE ORDER ================= */
orderRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product", "name imageUrl price");
    if (!order) return res.status(404).send({ message: "Order not found" });

    res.status(200).send({ order });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = { orderRouter };
