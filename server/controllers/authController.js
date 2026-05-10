const User = require('../models/User');
const { sendTokenResponse, verifyToken, generateToken } = require('../utils/jwt');
const { updateStreak } = require('../utils/xp');

// ── @route  POST /api/auth/register ──────────────────────────────────────────
// ── @access Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, department, rollNumber, semester, college } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name, email, password,
      role: role || 'student',
      department, rollNumber, semester, college,
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// ── @route  POST /api/auth/login ──────────────────────────────────────────────
// ── @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact admin.' });
    }

    // Update streak silently
    await updateStreak(user._id);

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ── @route  POST /api/auth/refresh ───────────────────────────────────────────
// ── @access Public (with refresh token)
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const newToken = generateToken(user._id, user.role);
    res.json({ success: true, token: newToken });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// ── @route  GET /api/auth/me ──────────────────────────────────────────────────
// ── @access Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('mentoring', 'name email department');
  res.json({ success: true, data: user });
};

// ── @route  POST /api/auth/logout ─────────────────────────────────────────────
// ── @access Private
const logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully' });
};

// ── @route  PUT /api/auth/change-password ─────────────────────────────────────
// ── @access Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, getMe, logout, changePassword };
