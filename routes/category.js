const express = require('express');
const router = express.Router();
const { categoryCreateValidator } = require('../validations/category');
const { runValidation } = require('../validations');
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { list, read, remove, create } = require('../controllers/category');

router.post(
  '/category',
  categoryCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);

router.get('/categories', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;
