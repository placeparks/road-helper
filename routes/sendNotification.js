const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post('/send-notification', async (req, res) => {
  const { token, title, message } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  const payload = {
   
    notification: {
      title: title,
      body: message
    },
    
  };

  try {
    const response = await admin.messaging().sendToDevice(token, payload);
    res.status(200).json({ messageId: response.results[0].messageId });
  } catch (error) {
    res.status(500).json({ error: error.message });  // Return the SDK's error message
  }
});

module.exports = router;
