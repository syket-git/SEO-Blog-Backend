const CategorySchema = require('../models/category');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

//create
exports.create = async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name).toLowerCase();
  const category = new CategorySchema({ name, slug });
  await category.save((err, data) => {
    if (err) return res.status(404).json({ error: errorHandler(err) });
    res.json(data);
  });
};

//List
exports.list = async (req, res) => {
  await CategorySchema.find().exec((err, data) => {
    if (err) return res.status(404).json({ err: errorHandler(err) });
    res.json(data);
  });
};

//Read
exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  await CategorySchema.findOne({ slug }).exec((err, data) => {
    if (err) return res.status(404).json({ err: errorHandler(err) });
    if (!data) return res.status(400).json({ error: 'Category not found' });
    res.json(data);
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
