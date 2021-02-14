const tagSchema = require('../models/tag');
const { errorHandler } = require('../helpers/dbErrorHandler');
const slugify = require('slugify');

//create
exports.create = async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name).toLowerCase();
  const tag = new tagSchema({ name, slug });
  await tag.save((err, data) => {
    if (err) return res.status(404).json({ error: errorHandler(err) });
    res.json(data);
  });
};

//list
exports.list = async (req, res) => {
  await tagSchema.find().exec((err, tag) => {
    if (err) return res.status(400).json({ err: errorHandler(err) });
    res.json(tag);
  });
};

//read
exports.read = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  await tagSchema.findOne({ slug }).exec((err, tag) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    if (!tag) return res.status(400).json({ error: 'Tag not found' });
    res.json(tag);
  });
};

//remove
exports.remove = async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  await tagSchema.findOneAndRemove({ slug }).exec((err, tag) => {
    if (err) return res.status(400).json({ error: errorHandler(err) });
    if (!tag) return res.status(400).json({ error: 'Tag not found' });
    res.json({ message: 'Tag deleted successfully' });
  });
};
