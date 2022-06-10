const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  GetCurrentUser,
} = require("../../controllers/auth");
const { schemaRegister, schemaLogin } = require("../../models/user");
const { validateRequest } = require("../../middlewares/validateRequest");
const { auth } = require("../../middlewares/auth");

router.post("/users/signup", validateRequest(schemaRegister), registerUser);
router.post("/users/login", validateRequest(schemaLogin), loginUser);
router.post("/users/logout", auth, logoutUser);
router.get("/users/current", auth, GetCurrentUser);

module.exports = router;
