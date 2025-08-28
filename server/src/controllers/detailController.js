// controllers/repoController.js
const githubService = require('../services/githubService');

exports.getRepoDetails = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;

    if (!owner || !repo) {
      return res.status(400).json({ success: false, message: 'Owner and repo are required' });
    }

    const [readme, commits, issues, repoInfo, languages] = await Promise.all([
      githubService.getRepoReadme(owner, repo),
      githubService.getRepoCommits(owner, repo),
      githubService.getRepoIssues(owner, repo),
      githubService.getRepoInfo(owner, repo), // ✅ includes stars, forks, open issues
      githubService.getRepoLanguages(owner, repo)
    ]);

    res.status(200).json({
      success: true,
      repo: `${owner}/${repo}`,
      description: repoInfo.description || '',
      languages: Object.keys(languages || {}),
      readme,
      stars: repoInfo.stargazers_count || 0,   // ✅ stars
      forks: repoInfo.forks_count || 0,       // ✅ forks
      created_at: repoInfo.created_at || '',
      website: repoInfo.homepage || '',
      commits: commits.slice(0, 10).map(c => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author.name,
        date: c.commit.author.date,
        url: c.html_url
      })),
      open_issues: issues.map(i => ({
        id: i.id,
        title: i.title,
        url: i.html_url,
        created_at: i.created_at,
        state: i.state
      }))
    });
  } catch (err) {
    next(err);
  }
};


// Individual commits (paginated)
exports.getRepoCommits = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const commits = await githubService.getRepoCommits(owner, repo, page, perPage);
    // Map for frontend table
    res.json(commits.map(c => ({
      sha: c.sha,
      message: c.commit.message,
      author: c.commit.author?.name || c.commit.committer?.name || 'Unknown',
  authorAvatar: c.author?.avatar_url || null,
  authorLogin: c.author?.login || null,
  date: c.commit.author?.date || c.commit.committer?.date || null,
      url: c.html_url
    })));
  } catch (err) { next(err); }
};

// Individual issues (paginated)
exports.getRepoIssues = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    const issues = await githubService.getRepoIssues(owner, repo, page, perPage);
    res.json(issues.map(i => ({
      id: i.id,
      title: i.title,
      url: i.html_url,
      created_at: i.created_at,
      state: i.state
    })));
  } catch (err) { next(err); }
};
