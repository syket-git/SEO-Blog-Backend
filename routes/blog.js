const express = require('express');
const router = express.Router();

//controllers
const {
  create,
  list,
  read,
  remove,
  update,
  listAllBlogsCategoriesTags,
} = require('../controllers/blog');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

//routes
router.post('/blog', requireSignin, adminMiddleware, create);
router.get('/blogs', list);
router.get('/blog/:slug', read);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.delete('/blog/:slug', remove);
router.put('/blog/:slug', update);

module.exports = router;
