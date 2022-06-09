const { User } = require("../models/user");
const errorHandler = require("../helpers/errors");
const SECRET_KEY = require("../helpers/env");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (userData) => {
  const result = await User.findOne({ email: userData.email });

  if (result) {
    throw errorHandler(409, "User already exists.");
  }

  const password = userData.password;
  const hashedPassword = await bcrypt.hash(password, 10);

  return User.create({
    ...userData,
    password: hashedPassword,
  });
};
