const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('morgan');
require('dotenv').config();

//bring routes
const blogRoute = require('./routes/blog');

//app
const app = express();

//middleware
app.use(logger('combined'));
app.use(bodyParser.json());
app.use(cookieParser());

//database
mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB Connected'))
  .catch((err) => console.log(err));

//cors
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

//routes middleware
app.use('/api/blog', blogRoute);

//route
app.get('/', (req, res) => {
  res.send('SEO BLOG BACKEND');
});

//port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server up and running on ${port}`));
