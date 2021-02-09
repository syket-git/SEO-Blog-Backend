const express = require('express');
const router = express.Router();

//controllers
const { time } = require('../controllers/blog');

//routes
router.get('/blog', time);

module.exports = router;
