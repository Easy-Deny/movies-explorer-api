require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./errors/error-handler');
const limiter = require('./utils/limiter');
const helmetModule = require('./utils/helmet');

const { NODE_ENV, BASE_PATH } = process.env;

const NotFoundError = require('./errors/not-found-error');

mongoose.connect(NODE_ENV === 'production' ? BASE_PATH : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(() => {
    console.log('Not connected to MongoDB');
  });
const app = express();
const PORT = 3500;
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'http://localhost:3000',
  'https://localhost:3000',
  'https://188.68.96.175',
  'http://easydeny.nomoredomainswork.ru',
  'https://easydeny.nomoredomainswork.ru',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});

app.use(express.json());
app.use(requestLogger);
app.use(limiter);
app.use(helmetModule);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(userRouter);
app.use(movieRouter);
app.all('*', (req, res, next) => {
  next(new NotFoundError('Page not found'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`port ${PORT}`);
});
