
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount.json');

// Be sure to initialize the app with your service account credentials and other necessary details
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  // other configuration...
});

router.post('/send-notification', async (req, res) => {
  const { token, title, message } = req.body;

  // Construct the message to be sent
  const payload = {
    notification: {
      title: title,
      body: message
    }
  };

  try {
    // Send a message to the device corresponding to the provided FCM token
    const response = await admin.messaging().sendToDevice(token, payload);
    res.status(200).json({ messageId: response.results[0].messageId });
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

module.exports = router;
    