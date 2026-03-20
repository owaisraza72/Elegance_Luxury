const express = require("express");
const { User } = require("../model/auth");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware/auth");
const {
  validateSignup,
  validateLogin,
  validateEditProfile,
} = require("../lib/utils");
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);

    const { name, email, password, gender, age, about, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      gender,
      age,
      about,
      role: role || "user", // COMMENT: seller/admin assign later
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).send({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/* ================= LOGIN ================= */
authRouter.post("/login", async (req, res) => {
  try {
    validateLogin(req);

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new Error("Invalid email or password");

    // Password match
    const isMatch = await user.validatePassword(password);
    if (!isMatch) throw new Error("Invalid email or password");

    // JWT token
    const token = await user.getjwt();

    // Cookie set
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Remove password before sending
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).send({
      message: "Login successful",
      user: userResponse, // role bhi yahin se frontend ko milta hai
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    res.status(400).send({ message: "BAD request ", error: error.message });
  }
});

authRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(200).send({ user: userResponse });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

authRouter.patch("/profile/edit", authMiddleware, async (req, res) => {
  try {
    validateEditProfile(req);
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    const userResponse = loggedInUser.toObject();
    delete userResponse.password;

    res.status(200).send({
      message: `${loggedInUser.name}, your profile has been updated!`,
      user: userResponse,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = { authRouter };
