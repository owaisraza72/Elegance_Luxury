const jwt = require("jsonwebtoken");
const { User } = require("../model/auth");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Unauthorized Access please login first");
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error("Unauthorized Access please login first");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({
      message: "Unauthorized Access please login first",
      error: error.message,
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ message: "Access denied. Admin only." });
  }
  next();
};

const sellerMiddleware = (req, res, next) => {
  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res.status(403).send({ message: "Access denied. Sellers only." });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, sellerMiddleware };
