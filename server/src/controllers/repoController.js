const githubService = require('../services/githubService');

exports.getUserRepos = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { filterByName, sortBy } = req.query;

    if (!username) return res.status(400).json({ error: "Username is required" });  
    //Optional here — Express will usually not hit this route without the param.

    const repos = await githubService.getUserRepos(username, { filterByName, sortBy });

    res.status(200).json({
      success: true,
      user: username,
      repositories: repos.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        open_issues: r.open_issues_count,
        url: r.html_url,
        language: r.language,
        created_at: r.created_at,
        updated_at: r.updated_at,
      })),
    });
  } catch (err) {
    next(err);
  }
};
