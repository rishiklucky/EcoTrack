const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (suspend/activate)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent suspending yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot suspend your own account' });
    }

    user.status = status;
    await user.save();

    res.json({
      success: true,
      message: `User account has been ${status} successfully`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    // Delete associated activities and goals
    await Activity.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and all associated data removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform-wide analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getPlatformAnalytics = async (req, res, next) => {
  try {
    // 1. Total Users (excluding admins)
    const totalUsers = await User.countDocuments({ role: 'user' });

    // 2. Average Carbon Score (excluding admins and users with no logs)
    const carbonScoreStats = await User.aggregate([
      { $match: { role: 'user', carbonScore: { $gt: 0 } } },
      { $group: { _id: null, avgScore: { $avg: '$carbonScore' } } },
    ]);
    const averageCarbonScore = carbonScoreStats.length > 0 ? parseFloat(carbonScoreStats[0].avgScore.toFixed(2)) : 0;

    // 3. Active Users (Users who have logged at least one activity)
    const activeUsers = await User.countDocuments({ role: 'user', carbonScore: { $gt: 0 } });

    // 4. Top Contributors (lowest carbonScore with at least 1 log)
    const topContributors = await User.find({ role: 'user', carbonScore: { $gt: 0 } })
      .select('name email carbonScore')
      .sort({ carbonScore: 1 }) // Lower is better
      .limit(5);

    // 5. Total activities logged on the platform
    const totalLogs = await Activity.countDocuments({});

    // 6. Category breakdown average (for and from all activities)
    const categoryBreakdown = await Activity.aggregate([
      {
        $group: {
          _id: null,
          avgCar: { $avg: '$transportation.carKm' },
          avgBike: { $avg: '$transportation.bikeKm' },
          avgTransit: { $avg: '$transportation.transitKm' },
          avgElectricity: { $avg: '$energy.electricityKwh' },
          avgLpg: { $avg: '$energy.lpgKg' },
          avgWater: { $avg: '$energy.waterLitres' },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        averageCarbonScore,
        activeUsers,
        totalLogs,
        topContributors,
        averages: categoryBreakdown.length > 0 ? categoryBreakdown[0] : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, updateUserStatus, deleteUser, getPlatformAnalytics };
