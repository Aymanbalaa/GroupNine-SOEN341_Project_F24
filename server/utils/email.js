// server/utils/email.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(
  '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',
);

const sendEmail = async (to, subject, text) => {
  const msg = {
    to,
    from: 'pojgsatools@gmail.com',
    subject,
    text,
  };

  try {
    console.log('Sending email to:', to);
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error(
      'Error sending email:',
      error.response ? error.response.body : error,
    );
    throw new Error('Email sending failed');
  }
};

module.exports = sendEmail;
