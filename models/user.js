const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      max: 32,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxLength: 32,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    profile: {
      type: String,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    about: {
      type: String,
    },
    role: {
      type: Number,
      require: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    resetPasswordLink: {
      data: String,
      default: '',
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model('User', userSchema);
