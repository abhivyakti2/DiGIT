const githubService = require('../services/githubService');

exports.getRepoTree = async (req, res, next) => {
  try {
    const { owner, repo, branch = 'main' } = req.query;

    if (!owner || !repo) {
      return res.status(400).json({ success: false, message: 'owner and repo are required' });
    }

    const tree = await githubService.fetchRepoTree(owner, repo, branch);

    res.status(200).json({
      success: true,
      tree // [{ path, type: 'blob' | 'tree', mode }]
    });
  } catch (err) {
    console.error('Error in getRepoTree:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

