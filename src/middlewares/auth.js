/* eslint-disable consistent-return */
const { check } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const { error } = require('../helpers/responseApi');

export const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Email is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
];

export const loginValidation = [
  check('email', 'Email is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
];

export const auth = async (req, res, next) => {
  const authorizationHeader = req.header('Authorization');
  if (!authorizationHeader) {
    return res.status(401).json(error('Unauthorized', res.statusCode));
  }
  const splitAuthorizationHeader = authorizationHeader.split(' ');

  const bearer = splitAuthorizationHeader[0];
  const token = splitAuthorizationHeader[1];

  if (bearer !== 'Bearer') {
    return res
      .status(400)
      .json(error('The type is must be a Bearer', res.statusCode));
  }

  if (!token) return res.status(404).json(error('No token found'));

  try {
    const jwtData = await jwt.verify(token, config.get('jwtSecret'));

    if (!jwtData) { return res.status(401).json(error('Unauthorized', res.statusCode)); }

    req.user = jwtData.user;

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json(error('Unauthorized', res.statusCode));
  }
};
