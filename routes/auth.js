const express = require('express');
const router = express.Router();
const {
  signup,
  signin,
  signout,
  requireSignin,
  authMiddleware,
  adminMiddleware,
  read,
} = require('../controllers/auth');

//validation
const { runValidation } = require('../validations');
const {
  userSignupValidation,
  userSigninValidation,
} = require('../validations/auth');

//routes with middlewares
router.post('/signup', userSignupValidation, runValidation, signup);
router.post('/signin', userSigninValidation, runValidation, signin);
router.get('/signout', signout);

router.get('/secret', requireSignin, authMiddleware, read);

module.exports = router;
