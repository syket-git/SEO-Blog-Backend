const User = require('../models/user');
const bcrypt = require('bcrypt');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  //check existing user
  const userExist = await User.findOne({ email });
  if (userExist) return res.status(400).json({ error: 'Email already exist' });

  //hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(password, salt);

  //create username and profile url
  const username = shortId.generate();
  const profile = `${process.env.CLIENT_URL}/profile/${username}`;

  //save new user
  let newUser = new User({
    name,
    email,
    hashed_password,
    username,
    profile,
  });
  await newUser.save((err, success) => {
    if (err) return res.status(400).json({ err });
    res.json({ status: 200, message: 'Signup success! Please signin.' });
  });
};

exports.signin = async (req, res) => {
  //check user exist or not
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  //match password
  let authenticatedUser = await bcrypt.compare(
    req.body.password,
    user.hashed_password
  );

  if (!authenticatedUser)
    return res.status(400).json({ error: 'Something went wrong!' });

  //create token

  const token = jwt.sign(
    { _id: authenticatedUser._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  //set cookie
  res.cookie('token', token, { expiresIn: '1d' });

  //create user object for send user
  const { _id, username, name, email, role } = user;
  res.json({ token, user: { _id, username, name, email, role } });
};

//signout controller
exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Signout Success!' });
};

// Verify middleware
exports.requireSignin = expressJwt({
  secret: `${process.env.JWT_SECRET}`,
  algorithms: ['HS256'],
});
