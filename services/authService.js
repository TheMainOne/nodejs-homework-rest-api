const { User } = require("../models/user");
const errorHandler = require("../helpers/errorHandler");
const Jimp = require("jimp");
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
  console.log(file);
  const { path: tempUpload, originalname } = file;
  const { id } = user;

  try {
    const resultUpload = path.join(avatarsDir, `${id}_${originalname}`);
    const avatarURL = path.join("public", "avatars", `${id}_${originalname}`);

    Jimp.read(tempUpload).then((image) => {
      return image.resize(250, 250).write(resultUpload);
    });
    await fs.unlink(tempUpload);

    await User.findByIdAndUpdate(user._id, { avatarURL }, { new: true });
    return { email: user.email, avatarURL: avatarURL };
  } catch (error) {
    await fs.unlink(tempUpload);
    errorHandler(400, "Can't save your avatar, something went wrong");
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
