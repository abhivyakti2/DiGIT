const githubService = require('../services/githubService');

exports.getCommitActivity = async (owner, repo, page = 1) => {
  const { data } = await apiClient.get(`/repos/${owner}/${repo}/commits`, {
    params: {
      per_page: 10,
      page: page,
    },
  });
  return data;
};
