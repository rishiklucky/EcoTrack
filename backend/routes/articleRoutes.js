const express = require('express');
const { getArticles, getArticleById, createArticle, updateArticle, deleteArticle } = require('../controllers/articleController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All routes require login
router.use(protect);

router.route('/')
  .get(getArticles)
  .post(adminOnly, createArticle);

router.route('/:id')
  .get(getArticleById)
  .put(adminOnly, updateArticle)
  .delete(adminOnly, deleteArticle);

module.exports = router;
