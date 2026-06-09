const express = require('express');
const { createActivity, getActivities, updateActivity, deleteActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(createActivity)
  .get(getActivities);

router.route('/:id')
  .put(updateActivity)
  .delete(deleteActivity);

module.exports = router;
