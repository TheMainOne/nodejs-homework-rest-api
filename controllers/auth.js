const authService = require("../services/authService");
const errorHandler = require("../helpers/errorHandler");
const { sendEmail } = require("../services/index");

const registerUser = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    await sendEmail(user.email, user.verificationToken);

    res.status(201).json({
      user: {
        email: user.email,
        password: user.password,
        subscription: user.subscription,
        avatarUrl: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const confirm = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await authService.findUser({ verificationToken });

    if (!user) {
      errorHandler(404, "User not found");
    }

    await authService.updateUser(user._id, {
      verify: true,
      verificationToken: null,
    });

    return res.status(200).json({
      code: 200,
      message: "Email was confirmed",
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { token, user } = await authService.loginUser(req.body);
    res.json({
      token: token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const GetCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email: email,
      subscription: subscription,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const updatedSubscription = req.body;
    const { email, subscription } = await authService.updateSubscription(
      _id,
      updatedSubscription
    );

    res.json({ email: email, subscription: subscription });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const avatar = await authService.updateAvatar(req.file, req.user);
    return res.json(avatar);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  GetCurrentUser,
  updateSubscription,
  updateAvatar,
  confirm,
};
