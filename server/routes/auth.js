// routes/auth.js

const express = require('express');

const router = express.Router();

const {
  register,
  verifyOtp,
  login,
  refresh,
  getMe,
  logout,
  changePassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

const {
  registerRules,
  loginRules,
  validate
} = require('../middleware/validate');


// ── Public Routes ─────────────────────────────────────────────

router.post(
  '/register',
  registerRules,
  validate,
  register
);

router.post(
  '/verify-otp',
  verifyOtp
);

router.post(
  '/login',
  loginRules,
  validate,
  login
);

router.post(
  '/refresh',
  refresh
);


// ── Private Routes ────────────────────────────────────────────

router.get(
  '/me',
  protect,
  getMe
);

router.post(
  '/logout',
  protect,
  logout
);

router.put(
  '/change-password',
  protect,
  changePassword
);


module.exports = router;