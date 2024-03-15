class NotFoundError extends Error {
  constructor(message) {
    super(`Error 404: ${message}`);
    this.statusCode = 404;
  }
}
module.exports = NotFoundError;
