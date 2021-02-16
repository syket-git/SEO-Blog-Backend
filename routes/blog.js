const express = require('express');
const router = express.Router();

//controllers
const { create } = require('../controllers/blog');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

//routes
router.post('/blog', requireSignin, adminMiddleware, create);

module.exports = router;
