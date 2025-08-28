const githubService = require('../services/githubService');

exports.getRepoTree = async (req, res, next) => {
  try {
    const { owner, repo } = req.query;

    if (!owner || !repo) {
      return res.status(400).json({ success: false, message: 'owner and repo are required' });
    }

    const branchesToTry = ['main', 'master'];
    let tree = null;
    let successBranch = null;

    for (const branch of branchesToTry) {
      try {
        tree = await githubService.fetchRepoTree(owner, repo, branch);
        if (tree && tree.length) {
          successBranch = branch;
          break;
        }
      } catch (err) {
        // Log specific branch failure but continue trying next branch
        console.warn(`Failed to fetch tree for branch "${branch}": ${err.message}`);
      }
    }

    if (!tree) {
      // Neither branch exists or no tree found for both
      return res.status(404).json({
        success: false,
        message: `Branches '${branchesToTry.join("' or '")}' not found or no tree available for repo ${owner}/${repo}`
      });
    }

    // Return consistent success response including the branch used
    return res.status(200).json({
      success: true,
      branch: successBranch,
      tree, // flat array [{ path, type, mode }]
    });
  } catch (err) {
    console.error('Error in getRepoTree:', err.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

