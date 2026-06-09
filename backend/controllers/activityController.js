const Activity = require('../models/Activity');
const User = require('../models/User');
const Badge = require('../models/Badge');
const { calculateCarbonFootprint } = require('../utils/calculator');

// Helper function to update user's overall carbon score and evaluate badges
const updateUserStats = async (userId) => {
  try {
    const user = await User.findById(userId).populate('badges.badge');
    if (!user) return;

    // 1. Calculate Average Carbon Score
    const activities = await Activity.find({ userId });
    let avgScore = 0;
    if (activities.length > 0) {
      const total = activities.reduce((sum, act) => sum + act.calculatedScore, 0);
      avgScore = parseFloat((total / activities.length).toFixed(2));
    }
    user.carbonScore = avgScore;

    // 2. Evaluate Badge Achievements
    const earnedBadgeNames = user.badges.map((b) => b.badge.name);
    const allBadgesInDb = await Badge.find({});

    const addBadgeIfEligible = async (badgeName, condition) => {
      if (!earnedBadgeNames.includes(badgeName) && condition) {
        const badgeObj = allBadgesInDb.find((b) => b.name === badgeName);
        if (badgeObj) {
          user.badges.push({ badge: badgeObj._id });
        }
      }
    };

    // Rule A: Green Beginner - Logged at least 1 activity
    await addBadgeIfEligible('Green Beginner', activities.length >= 1);

    // Rule B: Carbon Saver - Logged any activity with a score below 5.0 kg CO2e
    const lowScoreLogged = activities.some((act) => act.calculatedScore < 5.0);
    await addBadgeIfEligible('Carbon Saver', lowScoreLogged);

    // Rule C: Eco Warrior - Logged 5 or more activities
    await addBadgeIfEligible('Eco Warrior', activities.length >= 5);

    // Rule D: Sustainability Champion - Logged 10+ activities AND average score < 8.0 kg CO2e
    const champCondition = activities.length >= 10 && avgScore < 8.0;
    await addBadgeIfEligible('Sustainability Champion', champCondition);

    await user.save();
  } catch (error) {
    console.error('Error updating user stats/badges:', error.message);
  }
};

// @desc    Create daily activity footprint
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res, next) => {
  try {
    const { transportation, energy, food, waste, date } = req.body;

    // Set date to midnight to make standard daily comparisons
    const logDate = date ? new Date(date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    if (logDate > todayMidnight) {
      return res.status(400).json({ success: false, message: 'You cannot log a footprint for a future date.' });
    }

    // Check if activity already exists for this date
    let existingActivity = await Activity.findOne({
      userId: req.user._id,
      date: logDate,
    });

    const calculatedScore = calculateCarbonFootprint({ transportation, energy, food, waste });

    let activity;
    if (existingActivity) {
      // Overwrite/update existing log for the day
      existingActivity.transportation = transportation;
      existingActivity.energy = energy;
      existingActivity.food = food;
      existingActivity.waste = waste;
      existingActivity.calculatedScore = calculatedScore;
      activity = await existingActivity.save();
    } else {
      // Create new activity
      activity = await Activity.create({
        userId: req.user._id,
        transportation,
        energy,
        food,
        waste,
        calculatedScore,
        date: logDate,
      });
    }

    // Recalculate User's stats and badges
    await updateUserStats(req.user._id);

    // Fetch updated user to see if any new badges were earned
    const updatedUser = await User.findById(req.user._id).populate('badges.badge');

    res.status(201).json({
      success: true,
      data: activity,
      userCarbonScore: updatedUser.carbonScore,
      badgesCount: updatedUser.badges.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user activities (history)
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res, next) => {
  try {
    // Return sorted by date descending (most recent first)
    const activities = await Activity.find({ userId: req.user._id }).sort({ date: -1 });

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an activity
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = async (req, res, next) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity log not found' });
    }

    // Make sure user owns the activity
    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this log' });
    }

    const { transportation, energy, food, waste } = req.body;

    activity.transportation = transportation || activity.transportation;
    activity.energy = energy || activity.energy;
    activity.food = food || activity.food;
    activity.waste = waste || activity.waste;

    // Recalculate score
    activity.calculatedScore = calculateCarbonFootprint(activity);

    await activity.save();

    // Recalculate User's stats and badges
    await updateUserStats(req.user._id);

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity log not found' });
    }

    // Make sure user owns the activity
    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this log' });
    }

    await activity.deleteOne();

    // Recalculate User's stats and badges
    await updateUserStats(req.user._id);

    res.json({
      success: true,
      message: 'Activity log removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createActivity, getActivities, updateActivity, deleteActivity };
