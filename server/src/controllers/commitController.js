const githubService = require('../services/githubService');

exports.getRepoCommitActivity = async (req, res) => {
  const { owner, repo } = req.params;

  try {
    const commits = await githubService.getRepoCommitActivity(owner, repo);
    res.json({ success: true, activity: commits });
  } catch (err) {
    console.error('Commit fetch failed:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

