
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/:vehicleRegNo', async (req, res) => {
  const vehicleRegNo = req.params.vehicleRegNo;
  const user = await User.findOne({ vehicleRegNo: vehicleRegNo });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
});



module.exports = router;
    