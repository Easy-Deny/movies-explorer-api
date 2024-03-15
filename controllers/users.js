const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const { getJwtToken } = require('../utils/jwt');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => UserModel.create({
      email,
      password: hash,
      name,
    }))
    .then((data) => res.status(201).send({
      _id: data._id,
      email: data.email,
      name: data.name,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Incorrect user info error'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('User with an email address exists'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  UserModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Username or password is not correct');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Password is not correct'));
          }
          const token = getJwtToken({ _id: user._id });
          return res.status(200).send({
            token,
            email: user.email,
            name: user.name,
            _id: user._id,
          });
        });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email } = req.body;
  UserModel.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new BadRequestError('email exists'));
      }
      return UserModel
        .findByIdAndUpdate(req.user, req.body, { new: true, runValidators: true })
        .then((data) => res.status(200).send(data))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Incorrect user info'));
          }
          return next(err);
        });
    });
};

const getUser = (req, res, next) => UserModel
  .findById(req.user._id)
  .then((user) => {
    if (user) {
      return res.status(200).send(user);
    }
  })
  .catch(next);

module.exports = {
  getUser,
  updateUser,
  login,
  createUser,
};
