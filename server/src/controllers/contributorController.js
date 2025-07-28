const githubService = require('../services/githubService');

exports.getContributors = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const page = parseInt(req.query.page, 10) || 1;

    if (!owner || !repo) {
      return res.status(400).json({ success: false, message: 'Owner and repo are required' });
    }

    const contributors = await githubService.getRepoContributors(owner, repo, page);

    res.status(200).json({
      success: true,
      repo: `${owner}/${repo}`,
      current_page: page,
      contributors: contributors.map(c => ({
        username: c.login,
        avatar: c.avatar_url,
        contributions: c.contributions,
        url: c.html_url,
      })),
    });
  } catch (err) {
    next(err);
  }
};

