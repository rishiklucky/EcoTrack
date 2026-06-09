const Goal = require('../models/Goal');

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res, next) => {
  try {
    const { title, targetReduction, targetDate } = req.body;

    if (!title || !targetReduction || !targetDate) {
      return res.status(400).json({ success: false, message: 'Please provide goal title, target reduction, and target date' });
    }

    const goal = await Goal.create({
      userId: req.user._id,
      title,
      targetReduction,
      targetDate: new Date(targetDate),
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user goals
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: goals.length,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Check ownership
    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this goal' });
    }

    const { title, targetReduction, targetDate, currentProgress } = req.body;

    if (title) goal.title = title;
    if (targetReduction) goal.targetReduction = targetReduction;
    if (targetDate) goal.targetDate = new Date(targetDate);
    
    if (currentProgress !== undefined) {
      goal.currentProgress = currentProgress;
      // Auto-complete if progress reaches 100%
      if (currentProgress >= 100) {
        goal.status = 'completed';
      } else {
        goal.status = 'active';
      }
    }

    await goal.save();

    res.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Check ownership
    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this goal' });
    }

    await goal.deleteOne();

    res.json({
      success: true,
      message: 'Goal removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createGoal, getGoals, updateGoal, deleteGoal };
