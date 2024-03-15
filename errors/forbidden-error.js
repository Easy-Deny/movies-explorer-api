class ForbiddenError extends Error {
  constructor(message) {
    super(`Error 403: ${message}`);
    this.statusCode = 403;
  }
}
module.exports = ForbiddenError;
