const sgMail = require('@sendgrid/mail');
const sendGridAPIKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendGridAPIKey);

const sendWelcomeEmail = (email,name) => {
  sgMail.send({
    to: email,
    from: 'markanthonylumbao@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know once you receive this message.`
  });
}

const sendCancelationEmail = (email,name) => {
  sgMail.send({
    to: email,
    from: 'markanthonylumbao@gmail.com',
    subject: `So long and Goodbye ${name}!`,
    text: `We are sad to know that you're leaving the app, ${name}. Let us know what we can improve from our system.`
  });
}

module.exports = { sendWelcomeEmail,sendCancelationEmail };