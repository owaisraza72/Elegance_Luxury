const express = require("express");
const { User } = require("../model/auth");
const { Product } = require("../model/product");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const adminRouter = express.Router();

/* ================================================================ GET ALL USERS + SELLER ROUTES ================================================================ */
adminRouter.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).send({ users });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// ====================== ADD USER ROUTE ======================
adminRouter.post(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).send({ message: "User added", user });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
);

// ====================== UPDATE USER ROLE ======================
adminRouter.put(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true },
    );
    res.send({ message: "User updated", user });
  },
);

// ====================== DELETE USER ======================
adminRouter.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.send({ message: "User deleted" });
  },
);

/* ================================================================ GET ALL PRODUCTS ROUTES ================================================================ */
adminRouter.get(
  "/products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const products = await Product.find().populate("seller", "name email");
      res.status(200).send({ products });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
);

// ====================== ADMIN CREATE PRODUCT ======================
adminRouter.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const product = await Product.create({
        ...req.body,
        seller: req.user._id, // admin as seller
      });

      res.status(201).send({ message: "Product added by admin", product });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
);

// ====================== ADMIN UPDATE PRODUCT ======================
adminRouter.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(404).send({ message: "Product not found" });

      Object.assign(product, req.body);
      await product.save();

      res.status(200).send({ message: "Product updated by admin", product });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
);

// ====================== ADMIN DELETE PRODUCT ======================
adminRouter.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(404).send({ message: "Product not found" });

      await product.deleteOne();
      res.status(200).send({ message: "Product deleted by admin" });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
);

module.exports = { adminRouter };
