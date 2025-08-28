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

    const reposWithExtras = await Promise.all(
      result.repositories.map(async r => {
        let topics = [];
        let languages = [];

        try {
          topics = await githubService.getRepoTopics(r.owner.login, r.name);
        } catch {}

        try {
          const langs = await githubService.getRepoLanguages(r.owner.login, r.name);
          languages = Object.keys(langs);
        } catch {}

        return {
          id: r.id,
          name: r.name,
          description: r.description,
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language,
          languages,
          topics,
          url: r.html_url,
          open_issues: r.open_issues_count,  
          owner: r.owner?.login,
          updated_at: r.updated_at
        };
      })
    );

    res.status(200).json({
      success: true,
      query: q,
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      perPage: result.perPage,
      repositories: reposWithExtras
    });
  } catch (err) {
    next(err);
  }
};
