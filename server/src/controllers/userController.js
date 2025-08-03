// backend/controllers/userController.js
const githubService = require('../services/githubService');

exports.searchUsers = async (req, res, next) => {
  try {
    const { q, page = 1, per_page = 5 } = req.query;
    if (!q) return res.status(400).json({ success: false, error: "Missing search query" });

    const { users: searchResults, totalCount, currentPage, perPage } =
      await githubService.searchUsers(q, Number(page), Number(per_page));

    // Fetch more detailed info using existing service methods
    const userDetailsWithExtras = await Promise.all(
      searchResults.map(async (user) => {
        const profile = await githubService.getUserDetails(user.login);
        const repos = await githubService.getUserRepos(user.login);

        const mostStarredRepo = repos.reduce((top, repo) =>
          (top == null || repo.stargazers_count > top.stargazers_count) ? repo : top
        , null);

                         //////////////TOP 5 displayed?

        const languageSet = new Set(repos.map(r => r.language).filter(Boolean));

        const recentCommit = repos.length > 0 ? (await githubService.getRepoCommits(user.login, repos[0].name))?.[0]?.commit?.author?.date : null;

        return {
          username: profile.login,
          avatar: profile.avatar_url,
          bio: profile.bio,
          url: profile.html_url,
          id: profile.id,
          type: profile.type,
          mostStarredRepo: mostStarredRepo?.name || null,
          repoLanguages: [...languageSet],
          latestCommitDate: recentCommit || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      query: q,
      users: userDetailsWithExtras,
      totalCount,
      currentPage,
      perPage,
    });
  } catch (err) {
    next(err);
  }
};




exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ success: false, error: "Username is required" });

    const profile = await githubService.getUserDetails(username);
    const repos = await githubService.getUserRepos(username);

    const mostStarredRepo = repos.reduce((top, repo) =>
      (top == null || repo.stargazers_count > top.stargazers_count) ? repo : top
    , null);

    const languageSet = new Set(repos.map(r => r.language).filter(Boolean));

    const recentCommit = repos.length > 0
      ? (await githubService.getRepoCommits(username, repos[0].name))?.[0]?.commit?.author?.date
      : null;

    res.status(200).json({
      success: true,
      user: {
        username: profile.login,
        avatar: profile.avatar_url,
        bio: profile.bio,
        url: profile.html_url,
        id: profile.id,
        type: profile.type,
        mostStarredRepo: mostStarredRepo?.name || null,
        repoLanguages: [...languageSet],
        latestCommitDate: recentCommit || null,
      }
    });
  } catch (err) {
    next(err);
  }
};
