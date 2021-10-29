const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (subject, text) => {
  const msg = {
    to: "nimrah.yousuf@10pearls.com",
    from: "nimrah.yousuf@10pearls.com", // Use the email address or domain you verified above
    subject,
    text,
    // html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  //ES8
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
