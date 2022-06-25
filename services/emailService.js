const sgMail = require("@sendgrid/mail");
const errorHandler = require("../helpers/errorHandler");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;
const BASE_URL = `http://localhost:8000/api`;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (userEmail, code) => {
  const link = `${BASE_URL}/auth/users/verify/${code}`;

  const email = {
    to: userEmail,
    from: "leva880@ukr.net",
    subject: "Confirm your email",
    html: `<h4>Please click on this link to confirm your email ${link}</h4>`,
  };

  try {
    await sgMail.send(email);
    return true;
  } catch (error) {
    console.log(error.message);
    errorHandler(500, `${error.message}`);
  }
};

module.exports = sendEmail;
