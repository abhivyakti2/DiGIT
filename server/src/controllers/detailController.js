const githubService = require('../services/githubService');
const markdownService = require('../services/markdownService');

exports.getRepoDetails = async (req, res, next) => {
  try {
    const { owner, repo } = req.params;
    if (!owner || !repo) {
  return res.status(400).json({ success: false, message: 'Owner and repo are required' });
}
    const [readme, commits, issues,repoInfo, languages] = await Promise.all([
      githubService.getRepoReadme(owner, repo),
      githubService.getRepoCommits(owner, repo),
      githubService.getRepoIssues(owner, repo),
       githubService.getRepoInfo(owner, repo),        // ✅ New
      githubService.getRepoLanguages(owner, repo)    // ✅ New
    ]);
    res.status(200).json({
      success: true,
      repo: `${owner}/${repo}`,
       description: repoInfo.description || '',
      languages: Object.keys(languages || {}),
      readme, 
      commits: commits.slice(0,10).map(c => ({
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
  } catch (err) { next(err); }
};
