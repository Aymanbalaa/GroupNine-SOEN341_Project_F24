// server/routes/testEmail.js
const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/email');
router.get('/test-email', async (req, res) => {
  try {
    await sendEmail(
      'gghazal2004@gmail.com',
      'Test Email',
      'This is a test email.',
    );
    res.status(200).json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: 'Error sending test email' });
  }
});
module.exports = router;
