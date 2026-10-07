// Wraps a function so any error goes to the error handler instead of crashing the server
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};