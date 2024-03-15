class BadRequestError extends Error {
  constructor(message) {
    super(`Error 400: ${message}`);
    this.statusCode = 400;
  }
}
module.exports = BadRequestError;
