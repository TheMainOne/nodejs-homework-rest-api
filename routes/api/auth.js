const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  GetCurrentUser,
  updateSubscription,
} = require("../../controllers/auth");
const {
  schemaRegister,
  schemaLogin,
  schemaUpdateSubscription,
} = require("../../models/user");
const { validateRequest } = require("../../middlewares/validateRequest");
const { auth } = require("../../middlewares/auth");

router.post("/users/signup", validateRequest(schemaRegister), registerUser);
router.post("/users/login", validateRequest(schemaLogin), loginUser);
router.post("/users/logout", auth, logoutUser);
router.get("/users/current", auth, GetCurrentUser);
router.patch(
  "/users/",
  auth,
  validateRequest(schemaUpdateSubscription),
  updateSubscription
);

module.exports = router;
