const express = require('express');
const { getUsers, updateUserStatus, deleteUser, getPlatformAnalytics } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Require protection and admin privilege for all routes
router.use(protect);
router.use(adminOnly);

router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .delete(deleteUser);

router.route('/users/:id/status')
  .put(updateUserStatus);

router.route('/analytics')
  .get(getPlatformAnalytics);

module.exports = router;
