/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { randomString } = require('../helpers/common');
const { success, error, validation } = require('../helpers/responseApi');
const User = require('../models/User');
const Verification = require('../models/Verification');
/**
 * @desc    Register a new user
 * @method  POST api/auth/register
 * @access  public
 */
// eslint-disable-next-line consistent-return
exports.register = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) { return res.status(422).json(validation(errors.array())); }

  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    // Check the user email
    if (user) {
      return res
        .status(422)
        .json(validation({ msg: 'Email already registered' }));
    }

    const newUser = new User({
      name,
      email: email.toLowerCase().replace(/\s+/, ''),
      password,
    });

    // Hash the password
    const hash = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, hash);

    // Save the user
    await newUser.save();

    // Save token for user to start verificating the account
    const verification = new Verification({
      token: randomString(50),
      // eslint-disable-next-line no-underscore-dangle
      userId: newUser._id,
      type: 'Register New Account',
    });

    // Save the verification data
    await verification.save();

    // Send the response to server
    res.status(201).json(
      success(
        'Register success, please activate your account.',
        {
          user: {
            // eslint-disable-next-line no-underscore-dangle
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            verified: newUser.verified,
            verifiedAt: newUser.verifiedAt,
            createdAt: newUser.createdAt,
          },
          verification,
        },
        res.statusCode
      )
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

/**
 * @desc    Verify a new user
 * @method  GET api/auth/verify/:token
 * @access  public
 */
exports.verify = async (req, res) => {
  const { token } = req.params;

  try {
    let verification = await Verification.findOne({
      token,
      type: 'Register New Account',
    });

    // Check the verification data
    if (!verification) {
      return res
        .status(404)
        .json(error('No verification data found', res.statusCode));
    }

    // If verification data exists
    // Get the user data
    // And activate the account
    let user = await User.findOne({ _id: verification.userId }).select(
      '-password'
    );
    user = await User.findByIdAndUpdate(user._id, {
      $set: {
        verified: true,
        verifiedAt: new Date(),
      },
    });

    // After user successfully verified
    // Remove the verification data from database
    verification = await Verification.findByIdAndRemove(verification._id);

    // Send the response
    res
      .status(200)
      .json(
        success(
          'Your successfully verificating your account',
          null,
          res.statusCode
        )
      );
  } catch (err) {
    console.log(err);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

/**
 * @desc    Login a user
 * @method  POST api/auth/login
 * @access  public
 */
exports.login = async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) { return res.status(422).json(validation(errors.array())); }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check the email
    // If there's not exists
    // Throw the error
    if (!user) return res.status(422).json(validation('Invalid credentials'));

    // Check the password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) { return res.status(422).json(validation('Invalid credentials')); }

    // Check user if not activated yet
    // If not activated, send error response
    if (user && !user.verified) {
      return res
        .status(400)
        .json(error('Your account is not active yet.', res.statusCode));
    }

    // If the requirement above pass
    // Lets send the response with JWT token in it
    const payload = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;

        res
          .status(200)
          .json(success('Login success', { token }, res.statusCode));
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};

/**
 * @desc    Get authenticated user
 * @method  GET api/auth
 * @access  private
 */
exports.getAuthenticatedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    console.log('user: ', user);
    // Check the user just in case
    if (!user) { return res.status(404).json(error('User not found', res.statusCode)); }

    // Send the response
    res
      .status(200)
      .json(success(`Hello ${user.name}`, { user }, res.statusCode));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(error('Server error', res.statusCode));
  }
};
