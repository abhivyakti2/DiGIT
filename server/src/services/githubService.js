// backend/services/githubService.js
const apiClient = require('../utils/apiClient');

exports.searchUsers = async (query, page = 1, perPage = 5) => {
  const { data } = await apiClient.get(`/search/users`, {
    params: {
      q: query,
      per_page: perPage,
      page: page,
    },
  });

  // Get additional profile details (for the current page only)
  const detailPromises = data.items.map(user =>
    apiClient.get(`/users/${user.login}`).then(resp => resp.data)
  );

  const users = await Promise.all(detailPromises);

  return {
    users,
    totalCount: data.total_count,
    currentPage: page,
    perPage: perPage,
  };
};

exports.getUserRepos = async (username, { filterByName, sortBy } = {}) => {
  const { data } = await apiClient.get(`/users/${username}/repos`, {
    params: { per_page: 100, sort: 'updated' },
  });

  let repos = data;

  // Filter by name (case-insensitive match)
  if (filterByName) {
    repos = repos.filter(r =>
      r.name.toLowerCase().includes(filterByName.toLowerCase())
    );
  }

  // Define allowed sort fields and map them to GitHub fields
  const sortFieldMap = {
    stars: 'stargazers_count',
    forks: 'forks_count',
    issues: 'open_issues_count',
    name: 'name',
  };

  // Sort
  if (sortBy && sortFieldMap[sortBy]) {
    const field = sortFieldMap[sortBy];
    repos = repos.sort((a, b) => {
      // For string (name), use localeCompare
      if (field === 'name') return a.name.localeCompare(b.name);
      // For numbers (stars, forks, issues)
      return (b[field] ?? 0) - (a[field] ?? 0);
    });
  }

  return repos;
};

exports.getRepoCommitActivity = async (owner, repo) => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}/stats/commit_activity`);
  return data; // 52 items: one per week
};

exports.getRepoContributors = async (owner, repo) => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}/contributors`, { params: { per_page: 20 } });
  return data;
};

// Get README (as base64)
exports.getRepoReadme = async (owner, repo) => {
  try {
    const { data } = await apiClient.get(`/repos/${owner}/${repo}/readme`);
    const buff = Buffer.from(data.content, 'base64');
    return buff.toString();
  } catch (err) {
    if (err.response && err.response.status === 404) return '# No README found';
    throw err; // Let controller handle other errors
  }
};

exports.getRepoCommits = async (owner, repo) => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}/commits`, { params: { per_page: 10 } });
  return data;
};
exports.getRepoIssues = async (owner, repo) => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}/issues`, { params: { state: 'open', per_page: 10 } });
  return data.filter(i => !i.pull_request);
};
