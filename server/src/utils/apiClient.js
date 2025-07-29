const axios = require('axios');
require('dotenv').config(); 

const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github+json' },
  // Optionally: Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  timeout: 8000,
});

module.exports = apiClient;
