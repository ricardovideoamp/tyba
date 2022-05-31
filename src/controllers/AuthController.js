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

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { return res.status(422).json(validation(errors.array())); }

  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

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

    const hash = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, hash);

    await newUser.save();

    const verification = new Verification({
      token: randomString(50),
      userId: newUser._id,
      type: 'Register New Account',
    });

    await verification.save();

    res.status(201).json(
      success(
        'Register success, please activate your account.',
        {
          user: {
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

exports.verify = async (req, res) => {
  const { token } = req.params;

  try {
    let verification = await Verification.findOne({
      token,
      type: 'Register New Account',
    });

    if (!verification) {
      return res
        .status(404)
        .json(error('No verification data found', res.statusCode));
    }

    let user = await User.findOne({ _id: verification.userId }).select(
      '-password'
    );
    user = await User.findByIdAndUpdate(user._id, {
      $set: {
        verified: true,
        verifiedAt: new Date(),
      },
    });

    verification = await Verification.findByIdAndRemove(verification._id);

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

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { return res.status(422).json(validation(errors.array())); }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(422).json(validation('Invalid credentials'));

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) { return res.status(422).json(validation('Invalid credentials')); }
    if (user && !user.verified) {
      return res
        .status(400)
        .json(error('Your account is not active yet.', res.statusCode));
    }

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
