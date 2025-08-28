// backend/services/githubService.js
const apiClient = require("../utils/apiClient");


//                                     -----------------------SEARCH BAR USERS RESULT------------------------

exports.searchUsers = async (query, page = 1, perPage = 6) => {
  const { data } = await apiClient.get(`/search/users`, {
    params: {
      q: query,
      per_page: perPage,
      page: page,
    },
  });

  // Get additional profile details (for the current page only)
  const detailPromises = data.items.map((user) =>
    apiClient.get(`/users/${user.login}`).then((resp) => resp.data)
  );

  const users = await Promise.all(detailPromises);

  return {
    users,
    totalCount: data.total_count,
    currentPage: page,
    perPage: perPage,
  };
};

exports.searchRepositories = async (query, page = 1, perPage = 5) => {
    const { data } = await apiClient.get(`/search/repositories`, {
      params: {
        q: query,
        per_page: perPage,
        page: page,
      },
    });

    return {
      repositories: data.items,
      totalCount: data.total_count,
      currentPage: page,
      perPage,
    };
  };


exports.getUserDetails = async (username) => {
  const { data } = await apiClient.get(`/users/${username}`);
  return data;
};

exports.getUserRepos = async (username, { filterByName, sortBy } = {}) => {
  const { data } = await apiClient.get(`/users/${username}/repos`, {
    params: { per_page: 100, sort: "updated" },
  });

  let repos = data;

  // Filter by name (case-insensitive match)
  if (filterByName) {
    repos = repos.filter((r) =>
      r.name.toLowerCase().includes(filterByName.toLowerCase())
    );
  }

  // Define allowed sort fields and map them to GitHub fields
  const sortFieldMap = {
    stars: "stargazers_count",
    forks: "forks_count",
    issues: "open_issues_count",
    name: "name",
  };

  // Sort
  if (sortBy && sortFieldMap[sortBy]) {
    const field = sortFieldMap[sortBy];
    repos = repos.sort((a, b) => {
      // For string (name), use localeCompare
      if (field === "name") return a.name.localeCompare(b.name);
      // For numbers (stars, forks, issues)
      return (b[field] ?? 0) - (a[field] ?? 0);
    });
  }

  return repos;
};




exports.getRepoContributors = async (owner, repo, page = 1) => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}/contributors`, {
    params: {
      per_page: 5,
      page: page,
    },
  });
  return data;
};


// Get README (as base64)
exports.getRepoReadme = async (owner, repo) => {
  try {
    const { data } = await apiClient.get(`/repos/${owner}/${repo}/readme`);
    const buff = Buffer.from(data.content, "base64");
    return buff.toString();
  } catch (err) {
    if (err.response && err.response.status === 404) return "# No README found";
    throw err; // Let controller handle other errors
  }
};

exports.getRepoCommits = async (owner, repo, page = 1) => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}/commits`, {
    params: {
      per_page: 10,
      page: page,
    },
  });
  return data;
};

exports.getRepoIssues = async (owner, repo, page = 1, perPage = 10) => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}/issues`, {
    params: { state: "open", per_page: perPage, page },
  });
  return data.filter((i) => !i.pull_request);
};


exports.getRepoInfo = async (owner, repo) => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}`);
  return data;
};

exports.getRepoLanguages = async (owner, repo) => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}/languages`);
  return data;
};

exports.getRepoCommitActivity = async (owner, repo) => {
  try {
    const { data, status } = await apiClient.get(
      `/repos/${owner}/${repo}/stats/commit_activity`
    );

    if (status === 202 || !data) {
      return [];
    }

    const activity = data.map(week => ({
      week: new Date(week.week * 1000).toISOString().slice(0, 10), // e.g. "2025-08-11"
      total: week.total,
      days: week.days,
    }));

    return activity;

  } catch (error) {
    console.error('Error in getRepoCommitActivity:', error.message);
    throw error;
  }
};






exports.fetchRepoTree = async (owner, repo, branch = 'main') => {
  // Step 1: Get branch info
  const { data: branchData } = await apiClient.get(`/repos/${owner}/${repo}/branches/${branch}`);

  // ✅ Get tree SHA (not commit SHA)
  const treeSha = branchData.commit.commit.tree.sha;

  // Step 2: Fetch recursive tree using correct SHA
  const { data: treeData } = await apiClient.get(
    `/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`
  );

  return treeData.tree; // flat array: [{ path, type: 'blob' | 'tree', mode }]
};

exports.getRepoTopics = async (owner, repo) => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}/topics`, {
    headers: { Accept: "application/vnd.github.mercy-preview+json" } // Required for topics API
  });
  return data.names || [];
};


exports.getFileContent = async (owner, repo, path, branch = 'main') => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
  return Buffer.from(data.content, 'base64').toString('utf8');
};


// exports.searchCodeInRepo = async (query, owner, repo, page = 1, perPage = 5) => {
//   const { data } = await apiClient.get(`/search/code`, {
//     params: {
//       q: `${query}+repo:${owner}/${repo}`,
//       per_page: perPage,
//       page: page,
//     },
//   });

//   return {
//     items: data.items,
//     totalCount: data.total_count,
//     currentPage: page,
//     perPage,
//   };
// };