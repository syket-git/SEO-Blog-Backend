const CategorySchema = require('../models/category');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const Blog = require('../models/blog');

//create
exports.create = async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name).toLowerCase();
  const category = new CategorySchema({ name, slug });
  await category.save((err, data) => {
    if (err) return res.status(404).json({ error: errorHandler(err) });
    res.json({ message: 'Category create successfully' });
  });
};

//List
exports.list = async (req, res) => {
  await CategorySchema.find().exec((err, data) => {
    if (err) return res.status(404).json({ error: errorHandler(err) });
    res.json(data);
  });
};

//Read
exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  await CategorySchema.findOne({ slug }).exec((err, category) => {
    if (err) return res.status(404).json({ err: errorHandler(err) });
    if (!category) return res.status(400).json({ error: 'Category not found' });

    Blog.find({ categories: category })
      .populate('categories', '_id name slug')
      .populate('tags', '_id name slug')
      .populate('postedBy', '_id name')
      .select(
        '_id title slug categories tags excerpt postedBy createdAt updatedAt'
      )
      .exec((err, data) => {
        if (err) return res.status(400).json({ error: errorHandler(err) });
        res.json({ category: category, blogs: data });
      });
  });
};

//Remove
exports.remove = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  await CategorySchema.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) return res.status(404).json({ err: errorHandler(err) });
    if (!data) return res.status(400).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  });
};
