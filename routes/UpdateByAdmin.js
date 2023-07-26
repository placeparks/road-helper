const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');


// Update user profile using: PUT "/api/auth/updateprofile/:id". Requires auth
router.put('/updateprofile/:id', [
  body('username').optional().isLength({min:6}),
  body('firstName').optional(),
  body('lastName').optional(),
  body('vehicleRegNo').optional(),
  body('contactNumber').optional(),
  body('emergencyContactNumber').optional(),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('vehicleType').optional(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract user ID from route params
  const userId = req.params.id;

  try {
    // Find the user in the database and update their data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    // Update fields if provided
    if (req.body.username) user.username = req.body.username;
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.vehicleRegNo) user.vehicleRegNo = req.body.vehicleRegNo;
    if (req.body.contactNumber) user.contactNumber = req.body.contactNumber;
    if (req.body.emergencyContactNumber) user.emergencyContactNumber = req.body.emergencyContactNumber;
    if (req.body.gender) user.gender = req.body.gender;
    if (req.body.vehicleType) user.vehicleType = req.body.vehicleType;

    // Save the updated user
    await user.save();
    res.json({success: true, user});

  } catch (error) {
    console.error (error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
