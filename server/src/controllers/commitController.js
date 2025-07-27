const githubService = require('../services/githubService');

exports.getCommitActivity = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;

    if (!owner || !repo) {
      return res.status(400).json({ success: false, message: "Missing or invalid owner/repo" });
    }

    const weekly = await githubService.getRepoCommitActivity(owner, repo);

    // Handle GitHub’s 202 status or empty data
    if (!Array.isArray(weekly) || weekly.length === 0) {
      return res.status(202).json({
        success: false,
        message: "GitHub is still preparing commit activity data. Try again shortly.",
        repo: `${owner}/${repo}`,
        activity: [],
      });
    }

    res.status(200).json({
      repo: `${owner}/${repo}`,
      success: true,
      activity: weekly.map(w => ({
        weekStart: new Date(w.week * 1000).toISOString().slice(0, 10),
        total: w.total,
      })),
    });
  } catch (err) {
    next(err);
  }
};
