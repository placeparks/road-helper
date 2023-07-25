const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('No user found with that ID');
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
