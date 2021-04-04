const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');
const formidable = require('formidable');
const { stripHtml } = require('string-strip-html');
const slugify = require('slugify');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/blog');

//Create Blog
exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Image could not upload' });
    }

    const { title, body, categories, tags } = fields;

    if (!title || !title.length) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!body || body.length < 200) {
      return res.status(400).json({ error: 'Content is too short' });
    }

    if (!categories || categories.length === 0) {
      return res
        .status(400)
        .json({ error: 'At least one category is required' });
    }

    if (!tags || tags.length === 0) {
      return res.status(400).json({ error: 'At least one tag is required' });
    }

    let blog = new Blog();

    blog.title = title;
    blog.body = body;
    blog.excerpt = smartTrim(body, 320, ' ', ' ...');
    blog.slug = slugify(title).toLowerCase();
    blog.mtitle = `${title} | ${process.env.APP_NAME}`;
    blog.mdesc = stripHtml(body.substring(0, 160)).result;
    blog.postedBy = req.user._id;

    //categories and tags
    let arrayOfCategories = categories && categories.split(',');
    let arrayOfTags = tags && tags.split(',');

    if (files.photo) {
      if (files.photo.size > 10000000) {
        res.status(400).json({ error: 'Image size should not exceed 1mb ' });
      }
      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    }

    blog.save((err, result) => {
      if (err) return res.status(400).json({ error: errorHandler(err) });

      //Update  Categories
      Blog.findByIdAndUpdate(
        result._id,
        {
          $push: { categories: arrayOfCategories },
        },
        { new: true }
      ).exec((err, result) => {
        if (err) return res.status(400).json({ error: errorHandler(err) });

        //Update Tags
        Blog.findByIdAndUpdate(
          result._id,
          { $push: { tags: arrayOfTags } },
          { new: true }
        ).exec((err, result) => {
          if (err) return res.status(400).json({ error: errorHandler(err) });
          res.json({ message: 'Blog create successfully' });
        });
      });
    });
  });
};

//Get ALL Blogs

exports.list = (req, res) => {
  Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username')
    .select(
      '_id title slug excerpt createdAt updatedAt categories tags postedBy'
    )
    .exec((err, data) => {
      if (err) return res.json({ error: errorHandler(err) });
      res.json(data);
    });
};

//Get Specific Blog
exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOne({ slug })
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username')
    .select(
      '_id title body slug mtitle mdesc createdAt updatedAt categories tags postedBy'
    )
    .exec((err, data) => {
      if (err) return res.json({ error: errorHandler(err) });
      res.json(data);
    });
};

//Delete blog
exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) return res.json({ error: errorHandler(err) });
    res.json({ message: 'Blog deleted successfully' });
  });
};

//listAllBlogsCategoriesTags
exports.listAllBlogsCategoriesTags = (req, res) => {
  const limit = req.body.limit ? parseInt(req.body.limit) : 10;
  const skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let blogs;
  let categories;
  let tags;

  //Get ALL the blogs
  Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username profile')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      '_id title slug excerpt createdAt updatedAt categories tags postedBy'
    )
    .exec((err, data) => {
      if (err) return res.json({ error: errorHandler(err) });
      blogs = data; //blogs

      Category.find({}).exec((err, c) => {
        if (err) return res.json({ error: errorHandler(err) });
        categories = c; //Categories
      });
      Tag.find({}).exec((err, t) => {
        if (err) return res.json({ error: errorHandler(err) });
        tags = t; //Tags

        //Return all the blogs categories and tags
        res.json({ blogs, categories, tags, size: blogs.length });
      });
    });
};

//Update Blog
exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, oldBlog) => {
    if (err) return res.json({ error: errorHandler(err) });

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'Image could not upload' });
      }

      let slugBeforeMerge = oldBlog.slug;
      oldBlog = _.merge(oldBlog, fields);
      oldBlog.slug = slugBeforeMerge;

      const { body, desc, categories, tags } = fields;

      if (body) {
        oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
        oldBlog.desc = stripHtml(body.substring(0, 160));
      }

      if (categories) {
        oldBlog.categories = categories.split(',');
      }

      if (tags) {
        oldBlog.tags = tags.split(',');
      }

      if (files.photo) {
        if (files.photo.size > 10000000) {
          return res.status(400).json({
            error: 'Image should be less then 1mb in size',
          });
        }
        oldBlog.photo.data = fs.readFileSync(files.photo.path);
        oldBlog.photo.contentType = files.photo.type;
      }

      oldBlog.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        // result.photo = undefined;
        res.json(result);
      });
    });
  });
};

//Photo

exports.photo = (req, res) => {
  const slug = req.params.slug;
  Blog.findOne({ slug })
    .select('photo')
    .exec((err, blog) => {
      if (err || !blog)
        return res.status(400).json({ error: errorHandler(err) });
      res.set('Content-Type', blog.photo.contentType);
      res.send(blog.photo.data);
    });
};

// Related Blogs

exports.listRelated = (req, res) => {
  const limit = req.body.limit ? parseInt(req.body.limit) : 3;
  const { _id, categories } = req.body.blog;

  console.log(_id);

  Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
    .limit(limit)
    .populate('postedBy', '_id name profile')
    .select('title slug excerpt postedBy createdAt updatedAt')
    .exec((err, blogs) => {
      if (err) return res.status(400).json({ error: 'Blogs not found!' });
      res.json(blogs);
    });
};

//Blog Search

exports.listSearch = (req, res) => {
  console.log(req);
  const { search } = req.query;
  if (search) {
    Blog.find(
      {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { body: { $regex: search, $options: 'i' } },
        ],
      },
      (err, blogs) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(blogs);
      }
    ).select('-photo -body');
  }
};
