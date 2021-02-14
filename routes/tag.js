const express = require('express');
const router = express.Router();
const { tagCreateValidator } = require('../validations/tag');
const { runValidation } = require('../validations');
const { requireSignin, authMiddleware } = require('../controllers/auth');
const { create, list, read, remove } = require('../controllers/tag');

router.post(
  '/tag',
  tagCreateValidator,
  runValidation,
  requireSignin,
  authMiddleware,
  create
);
router.get('/tags', list);
router.get('/tag/:slug', read);
router.delete('/tag/:slug', requireSignin, authMiddleware, remove);

module.exports = router;
