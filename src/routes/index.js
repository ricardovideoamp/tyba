import express from 'express';

import { indexPage, messagesPage } from '../controllers';

const { registerValidation, loginValidation, auth } = require('../middlewares/auth');

const {
  register, verify, login, getAuthenticatedUser
} = require('../controllers/AuthController');

const router = express.Router();

router.get('/restaurants', messagesPage);
router.get('/', indexPage);
router.post('/register', registerValidation, register);
router.get('/verify/:token', verify);
router.post('/login', loginValidation, login);
router.get('/', auth, getAuthenticatedUser);

export default router;
