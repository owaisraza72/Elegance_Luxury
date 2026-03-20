const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must be at least 8 characters long and contain uppercase, lowercase, number & special character",
          );
        }
      },
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender must be male, female or other");
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 120,
    },
    about: {
      type: String,
      trim: true,
      maxLength: 500,
      lowercase: true,
      default: "this user prefers to keep an air of mystery about them.",
    },
    skills: {
      type: [String],
      default: ["none"],
    },
    photoURL: {
      type: String,
      trim: true,
      default: "https://www.example.com/default-photo.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL format for photoURL");
        }
      },
    },
  },
  {
    collection: "users",
    timestamps: true,
  },
);

userSchema.methods.getjwt = async function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
};

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
