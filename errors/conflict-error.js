class ConflictError extends Error {
  constructor(message) {
    super(`Error 409: ${message}`);
    this.statusCode = 409;
  }
}
module.exports = ConflictError;
