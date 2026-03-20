const validator = require("validator");

function validateSignup(req) {
  const { name, email, password } = req.body;

  if (!name) {
    throw new Error("Name is required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email Address!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
}

function validateLogin(req) {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    throw new Error("Invalid Email Address");
  }

  if (!password) {
    throw new Error("Password is required");
  }
}

function validateEditProfile(req) {
  const allowedEditFields = [
    "name",
    "gender",
    "age",
    "about",
    "skills",
    "photoURL",
  ];

  const updates = Object.keys(req.body);

  const isUpdateAllowed = updates.every((field) =>
    allowedEditFields.includes(field),
  );

  if (!isUpdateAllowed) {
    throw new Error("Invalid field to update!");
  }

  // individual field validation if needed
  if (req.body.name && req.body.name.length < 3) {
    throw new Error("Name must be more than 3 characters!");
  }
}

module.exports = {
  validateSignup,
  validateLogin,
  validateEditProfile,
};
