/**
 * Module dependencies.
 */
var util = require('util');

/**
 * `AbstractError` error.
 *
 * @api private
 */
function AbstractError(message, constr) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, constr || this);

  this.name = 'AbstractError';
  this.message = message;
}

/**
 * Inherit from `Error`.
 */
util.inherits(AbstractError, Error);

/**
 * `IntercomError` error.
 *
 * @api private
 */
function IntercomError(message, errors) {
  AbstractError.apply(this, arguments);
  this.name = 'IntercomError';
  this.message = message;
  this.errors = data.errors;
}

/**
 * Inherit from `AbstractError`.
 */
util.inherits(IntercomError, AbstractError);


/**
 * Expose `IntercomError`.
 */
module.exports = IntercomError;
