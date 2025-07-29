const githubService = require('../services/githubService');
const axios = require('axios');

exports.getFileContent = async (req, res) => {
  try {
    const { owner, repo, path, branch = 'main' } = req.query;
    if (!owner || !repo || !path) {
      return res.status(400).json({ message: 'owner, repo, and path are required' });
    }

    const content = await githubService.getFileContent(owner, repo, path, branch);
    res.json({ success: true, content });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch file content', error: err.message });
  }
};

exports.getFileContentAndAskAI = async (req, res) => {
  try {
    const { owner, repo, path, branch = 'main', question } = req.query;

    if (!owner || !repo || !path || !question) {
      return res.status(400).json({ message: 'owner, repo, path, and question are required' });
    }

    // Step 1: Get file content from GitHub
    const content = await githubService.getFileContent(owner, repo, path, branch);

    // Step 2: Ask AI
    const aiRes = await axios.post('http://localhost:5001/ask', {
      content: `${question}\n\n${content}`
    });

    res.json({ success: true, answer: aiRes.data.response });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process AI response', error: err.message });
  }
};