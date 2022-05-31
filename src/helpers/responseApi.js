/* eslint-disable no-param-reassign */

exports.success = (message, results, statusCode) => ({
  message,
  error: false,
  code: statusCode,
  results
});

exports.error = (message, statusCode) => {
  const codes = [ 200, 201, 400, 401, 404, 403, 422, 500 ];

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

exports.validation = (errors) => ({
  message: 'Validation errors',
  error: true,
  code: 422,
  errors
});
