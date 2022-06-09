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
    const token = await authService.loginUser(req.body);
    res.json(token);
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

module.exports = { registerUser, loginUser, logoutUser };
