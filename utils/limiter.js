const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 10 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

module.exports = limiter;
