const User = require('../models/User');
const Skill = require('../models/Skill');
const Goal = require('../models/Goal');
const Project = require('../models/Project');
const { awardXP } = require('../utils/xp');

// ── @route  GET /api/users ────────────────────────────────────────────────────
// ── @access Faculty, Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { dept, role, aspiration, semester, search, page = 1, limit = 20, sort = '-xpPoints' } = req.query;

    const query = { isActive: true };
    if (dept)        query.department  = dept;
    if (role)        query.role        = role;
    if (aspiration)  query.aspiration  = aspiration;
    if (semester)    query.semester    = Number(semester);
    if (search) {
      query.$or = [
        { name:       { $regex: search, $options: 'i' } },
        { email:      { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// ── @route  GET /api/users/:id ────────────────────────────────────────────────
// ── @access Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Attach skills, goals, projects for full profile
    const [skills, goals, projects] = await Promise.all([
      Skill.find({ user: user._id, isPublic: true }).sort('-level'),
      Goal.find({ user: user._id, isPublic: true, status: 'active' }),
      Project.find({ user: user._id, isPublic: true }).sort('-createdAt'),
    ]);

    res.json({ success: true, data: { user, skills, goals, projects } });
  } catch (err) {
    next(err);
  }
};

// ── @route  PUT /api/users/:id ────────────────────────────────────────────────
// ── @access Private (owner or admin)
const updateUser = async (req, res, next) => {
  try {
    // Fields a user is allowed to update themselves
    const allowed = ['name','bio','phone','semester','cgpa','aspiration',
                     'socialLinks','resumeUrl','avatar','department','rollNumber','batch','section'];

    // Admin can also update role, isActive, etc.
    if (['admin'].includes(req.user.role)) {
      allowed.push('role', 'isActive', 'designation', 'subjects');
    }

    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    }).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// ── @route  PUT /api/users/:id/coding-stats ───────────────────────────────────
// ── @access Private (owner)
// Manually update coding stats (until API integration is live)
const updateCodingStats = async (req, res, next) => {
  try {
    const { leetcodeSolved, leetcodeEasy, leetcodeMedium, leetcodeHard,
            codeforcesRating, codeforcesMaxRating, githubContributions, githubRepos,
            contestsParticipated } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const prev = user.codingStats.leetcodeSolved || 0;

    Object.assign(user.codingStats, {
      ...(leetcodeSolved        !== undefined && { leetcodeSolved }),
      ...(leetcodeEasy          !== undefined && { leetcodeEasy }),
      ...(leetcodeMedium        !== undefined && { leetcodeMedium }),
      ...(leetcodeHard          !== undefined && { leetcodeHard }),
      ...(codeforcesRating      !== undefined && { codeforcesRating }),
      ...(codeforcesMaxRating   !== undefined && { codeforcesMaxRating }),
      ...(githubContributions   !== undefined && { githubContributions }),
      ...(githubRepos           !== undefined && { githubRepos }),
      ...(contestsParticipated  !== undefined && { contestsParticipated }),
      lastUpdated: new Date(),
    });

    // XP for new problems solved
    const newSolved = (leetcodeSolved || 0) - prev;
    if (newSolved > 0) {
      user.xpPoints += newSolved * 10;
    }

    await user.save();

    // Check for new achievements
    const { checkAchievements } = require('../utils/xp');
    const newAchievements = await checkAchievements(user._id);

    res.json({ success: true, data: user.codingStats, newAchievements });
  } catch (err) {
    next(err);
  }
};

// ── @route  DELETE /api/users/:id ─────────────────────────────────────────────
// ── @access Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (err) {
    next(err);
  }
};

// ── @route  GET /api/users/search/skills ─────────────────────────────────────
// ── @access Faculty, Admin
// Find students who have a specific skill
const searchBySkill = async (req, res, next) => {
  try {
    const { skill, minLevel = 0 } = req.query;
    if (!skill) return res.status(400).json({ success: false, message: 'skill query param required' });

    const skills = await Skill.find({
      name: { $regex: skill, $options: 'i' },
      level: { $gte: Number(minLevel) },
    }).populate('user', 'name email department semester cgpa aspiration avatar rollNumber');

    const results = skills.map(s => ({
      user: s.user,
      skillName: s.name,
      skillLevel: s.level,
      category: s.category,
    }));

    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, updateCodingStats, deleteUser, searchBySkill };
