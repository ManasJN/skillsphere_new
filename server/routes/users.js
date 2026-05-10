const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, updateCodingStats, deleteUser, searchBySkill } = require('../controllers/userController');
const { protect, authorize, ownerOrAdmin } = require('../middleware/auth');

// All routes require login
router.use(protect);

router.get ('/',                       authorize('faculty', 'admin'), getAllUsers);
router.get ('/search/skills',          authorize('faculty', 'admin'), searchBySkill);
router.get ('/:id',                    getUserById);
router.put ('/:id',                    ownerOrAdmin('id'), updateUser);
router.put ('/:id/coding-stats',       ownerOrAdmin('id'), updateCodingStats);
router.delete('/:id',                  authorize('admin'), deleteUser);

module.exports = router;
