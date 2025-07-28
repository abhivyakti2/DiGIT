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


exports.searchRepositories = async (req, res, next) => {
  try {
    const { q, page = 1, perPage = 5 } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, error: 'Search query (q) is required' });
    }

    const result = await githubService.searchRepositories(q, page, perPage);

    res.status(200).json({
      success: true,
      query: q,
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      perPage: result.perPage,
      repositories: result.repositories.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        url: r.html_url,
        owner: r.owner?.login,
        updated_at: r.updated_at,
      })),
    });
  } catch (err) {
    next(err);
  }
};


exports.searchCodeInRepo = async (req, res, next) => {
  try {
    const { owner, repo, q, page = 1, perPage = 5 } = req.query;

    if (!q || !owner || !repo) {
      return res.status(400).json({ success: false, error: 'Query (q), owner, and repo are required.' });
    }

    const result = await githubService.searchCodeInRepo(q, owner, repo, page, perPage);

    res.status(200).json({
      success: true,
      query: q,
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      perPage: result.perPage,
      results: result.items.map(item => ({
        name: item.name,
        path: item.path,
        repository: item.repository.full_name,
        html_url: item.html_url,
        score: item.score,
      })),
    });
  } catch (err) {
    next(err);
  }
};
