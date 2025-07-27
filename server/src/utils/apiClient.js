const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: { 'Accept': 'application/vnd.github+json' },
  // Optionally: Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  timeout: 8000,
});

module.exports = apiClient;
