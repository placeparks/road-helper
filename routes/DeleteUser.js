const express = require('express');
const router = express.Router();
const User = require('../models/User');

//delete a user using: DELETE "/api/auth/delete/:id". Doesn't require auth
router.delete('/delete/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      // Find the user in the database and delete their data
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({error: 'User not found'});
      }
  
      res.json({success: true, message: 'User successfully deleted'});
    } catch (error) {
      console.error (error.message);
      res.status(500).send('Server error');
    }
  });
  

    module.exports = router;