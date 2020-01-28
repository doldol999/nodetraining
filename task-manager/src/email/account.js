const sgMail = require('@sendgrid/mail');
const sendGridAPIKey = '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';
sgMail.setApiKey(sendGridAPIKey);

const msg = {
  to: 'lumbao.mark@xtendops.com',
  from: 'lumbao.mark@xtendops.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);