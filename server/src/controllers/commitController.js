const githubService = require('../services/githubService');

exports.getCommitActivity = async (req, res) => {
  const { owner, repo } = req.params;
  const { page = 1 } = req.query;

  try {
    const commits = await githubService.getCommitActivity(owner, repo, page);
    res.json({ success: true, data: commits });
  } catch (err) {
    console.error('Commit fetch failed:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
