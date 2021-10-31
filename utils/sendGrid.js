const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (subject, value, type) => {
  let html;
  if (type === "otp") {
    html = `<h2>Your OTP for password change is: <span style="color:blue">${value}</span></h2>`;
  }
  const msg = {
    to: process.env.TO_EMAIL,
    from: process.env.FROM_EMAIL,
    subject,
    // text,
    html,
  };

  (async () => {
    try {
      await sgMail.send(msg);
      console.log("email sent");
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
};

module.exports = { sendEmail };
