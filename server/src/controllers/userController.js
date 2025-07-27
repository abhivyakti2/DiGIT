// backend/controllers/userController.js
const githubService = require('../services/githubService');

exports.searchUsers = async (req, res, next) => {
  try {
    const { q, page = 1, per_page = 5 } = req.query;

    if (!q) return res.status(400).json({ success: false, error: "Missing search query" });

    const { users, totalCount, currentPage, perPage } = await githubService.searchUsers(q, Number(page), Number(per_page));

    res.status(200).json({
      success: true,
      query: q,
      users: users.map(u => ({
        username: u.login,
        avatar: u.avatar_url,
        bio: u.bio,
        url: u.html_url,
        id: u.id,
        type: u.type,
      })),
      totalCount,
      currentPage,
      perPage,
    });
  } catch (err) {
    next(err);
  }
};

