/* eslint-disable no-param-reassign */
/**
 * @desc    This file contain Success and Error response for sending to client / user
 * @author  Huda Prasetyo
 * @since   2020
 */

/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} results
 * @param   {number} statusCode
 */
exports.success = (message, results, statusCode) => ({
  message,
  error: false,
  code: statusCode,
  results
});

/**
   * @desc    Send any error response
   *
   * @param   {string} message
   * @param   {number} statusCode
   */
exports.error = (message, statusCode) => {
  // List of common HTTP request code
  const codes = [ 200, 201, 400, 401, 404, 403, 422, 500 ];

  // Get matched code
  // eslint-disable-next-line eqeqeq
  const findCode = codes.find((code) => code == statusCode);

  // eslint-disable-next-line no-param-reassign
  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    message,
    code: statusCode,
    error: true
  };
};

/**
   * @desc    Send any validation response
   *
   * @param   {object | array} errors
   */
exports.validation = (errors) => ({
  message: 'Validation errors',
  error: true,
  code: 422,
  errors
});
