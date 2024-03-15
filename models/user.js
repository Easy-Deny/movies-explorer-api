const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validation: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'invalid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'User',
  },
});
module.exports = mongoose.model('user', userSchema);
