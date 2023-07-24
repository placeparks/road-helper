const express = require ('express');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const User= require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const jwtt = 'Blessyou@123';


//Create new user using: POST "/api/auth/". Doesn't require auth
router.post('/signup',[
    body('username').isLength({min:4}),
    body('email', 'enter a valid email').isEmail(),
    body('password').isLength({ min: 10 }), 
    body('firstName').isLength({min:3}),
    body('lastName').isLength({min:3}),
    body('vehicleRegNo').isLength({min:3}),
    body('contactNumber').isLength({min:10}),
    body('emergencyContactNumber').isLength({min:10}),
    body('gender').isLength({min:3}),
    body('vehicleType').isLength({min:3})
  ], 
 async (req, res)=> {
  let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }

    // Handle the case when there are no validation errors
  //we are checking whether the user already exists with the same email or not
   
  try {
    let user = await User.findOne({ email: req.body.email });
    if(user) {
      success = false;
      return res.status(400).json({ error: "Sorry, a user with this email already exists" });
    }

    user = await User.findOne({ username: req.body.username });
    if(user) {
      success = false;
      return res.status(400).json({ error: "Sorry, a user with this username already exists" });
    }
//securing password
const salt = await bcrypt.genSaltSync(10);
const secPass= await bcrypt.hash(req.body.password,salt);

  //create a new user
  user = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    vehicleRegNo: req.body.vehicleRegNo,
    contactNumber: req.body.contactNumber,
    emergencyContactNumber: req.body.emergencyContactNumber,
    gender: req.body.gender,
    vehicleType: req.body.vehicleType
  });

//generate jwt token
const data={
    user:{
        id:user.id
    }
}

const token = jwt.sign(data, jwtt);
success = true;
res.json({success, token});
}
catch (error){
            console.error (error.message);
            res.status(500).send('invalid value, please try again');
        }
})



//login a user using: POST "/api/auth/login".
router.post('/login',[
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password cannot be blank').exists(), ],
async (req, res)=> {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); 
  }


  const {email, password} = req.body;
  try {
    let user = await User.findOne({email});
    if(!user) {
      let success = false;
      return res.status(400).json({error: "Sorry, please enter correct email"});
    }

//check password
const passwordCompare = await bcrypt.compare(password, user.password);
if (!passwordCompare) {
  let success = false;
  return res.status(400).json({error: "Please try to login with correct credentials" });
}

//generate jwt token
const data={
  user:{
      id:user.id
  }
}

const token = jwt.sign(data, jwtt);
success = true;
let userResponse = user.toObject();
delete userResponse.password;

// Return the user object (without the password) in the response along with the success message and token
res.json({ success, user: userResponse, token});
}
catch (error) {
console.error (error.message);
res.status(500).send('Invalid value, please try again');
}
})


   
//update user using: PUT "/api/auth/update". Requires auth
router.put('/update', [
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

  // Extract user ID from JWT token
  const token = req.headers['authorization'];
  const decoded = jwt.verify(token, jwtt);
  const userId = decoded.user.id;

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
