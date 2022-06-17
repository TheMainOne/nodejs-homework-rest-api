const { User } = require("../models/user");
const errorHandler = require("../helpers/errorHandler");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
require("dotenv").config();
const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const result = await User.findOne({ email });

  if (result) {
    errorHandler(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  return User.create({
    name,
    email,
    password: hashedPassword,
    avatarURL,
  });
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    errorHandler(401, "Login or password is wrong");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    errorHandler(401, "Login or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });

  await User.findByIdAndUpdate(user._id, { token });

  return {
    user,
    token,
  };
};

const logoutUser = async (id) => {
  await User.findByIdAndUpdate(id, { token: null });
};

const authenticateUser = async (token) => {
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    const { id } = payload;
    const user = await User.findById(id);

    return user.token !== token ? null : user;
  } catch (error) {
    return null;
  }
};

const updateSubscription = async (_id, updatedSubscription) => {
  const user = User.findByIdAndUpdate(_id, updatedSubscription, { new: true });

  if (!user) {
    errorHandler(404, "Not Found");
  }
  return user;
};

const updateAvatar = async (file, user) => {
  const { path, originalname } = file;

  try {
    const resultUpload = path.join(avatarsDir, originalname);
    await fs.rename(path, resultUpload);
    const avatarURL = path.join("public", "avatars", originalname);
    console.log(avatarURL);
    await User.findByIdAndUpdate(user._id, { avatarURL }, { new: true });
    return { avatarURL };
  } catch (error) {
    await fs.unlink(path);
    errorHandler(400, "Can't save your avatar");
  }
};

module.exports = {
  registerUser,
  loginUser,
  authenticateUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
};
