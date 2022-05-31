import express from 'express';

import { restaurantsPage } from '../controllers';

const { registerValidation, loginValidation, auth } = require('../middlewares/auth');

const {
  register, verify, login
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerValidation, register);
router.get('/verify/:token', verify);
router.post('/login', loginValidation, login);
router.get('/restaurants', auth, restaurantsPage);

export default router;
