const { celebrate, Joi } = require('celebrate');
const Router = require('express').Router();
const {
  getUser,
  updateUser,
  login,
  createUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

Router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
Router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
Router.use(auth);
Router.get('/users/me', getUser);
Router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
module.exports = Router;
