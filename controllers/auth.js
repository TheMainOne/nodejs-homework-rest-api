const authService = require("../services/authService");

const registerUser = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      user: {
        email: user.email,
        password: user.password,
        subscription: user.subscription,
      },
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
    const userWithNewData = await authService.updateSubscription(
      _id,
      updatedSubscription
    );

    res.json(userWithNewData);
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
};
