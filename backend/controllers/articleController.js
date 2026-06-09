const Article = require('../models/Article');

// @desc    Get all articles with optional search and category filters
// @route   GET /api/articles
// @access  Private
const getArticles = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Apply category filter
    if (category) {
      query.category = category;
    }

    // Apply search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await Article.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Private
const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private/Admin
const createArticle = async (req, res, next) => {
  try {
    const { title, category, content, image, readingTime } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ success: false, message: 'Please provide title, category and content' });
    }

    const article = await Article.create({
      title,
      category,
      content,
      image,
      readingTime: readingTime || Math.max(1, Math.round(content.split(' ').length / 200)), // dynamic calculation fallback
      author: req.user.name,
    });

    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private/Admin
const updateArticle = async (req, res, next) => {
  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const { title, category, content, image, readingTime } = req.body;

    if (title) article.title = title;
    if (category) article.category = category;
    if (content) article.content = content;
    if (image) article.image = image;
    if (readingTime) article.readingTime = readingTime;

    await article.save();

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private/Admin
const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    await article.deleteOne();

    res.json({
      success: true,
      message: 'Article removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getArticles, getArticleById, createArticle, updateArticle, deleteArticle };
