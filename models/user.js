const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { v4 } = require("uuid");

const schema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: () => v4(),
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", schema);

const schemaRegister = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  subscription: Joi.string(),
});

const schemaLogin = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const schemaUpdateSubscription = Joi.object({
  subscription: Joi.string().required().valid("starter", "pro", "business"),
});

module.exports = {
  User,
  schemaRegister,
  schemaLogin,
  schemaUpdateSubscription,
};
