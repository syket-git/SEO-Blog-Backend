const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors2 = require('cors');
const cors = require('morgan');
require('dotenv').config();

//bring routes
const blogRoute = require('./routes/blog');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const tagRoute = require('./routes/tag');

//app
const app = express();

//middleware
app.use(logger('combined'));
app.use(cors2());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

//database
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log('DB Connected'))
  .catch((err) => console.log(err));

//cors
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

//routes middleware
app.use('/api', blogRoute);
app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', categoryRoute);
app.use('/api', tagRoute);

//route
app.get('/', (req, res) => {
  res.send('SEO BLOG BACKEND');
});

//port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server up and running on ${port}`));
