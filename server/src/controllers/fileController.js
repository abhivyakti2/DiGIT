const githubService = require('../services/githubService');
const axios = require('axios');
exports.getFileContent = async (req, res) => {
  try {
    const { owner, repo, path } = req.query;
    let branch = req.query.branch || 'main';
    if (!owner || !repo || !path) {
      return res.status(400).json({ message: 'owner, repo, and path are required' });
    }

    // Try main and master just like the tree endpoint
    const branchesToTry = [branch, branch === 'main' ? 'master' : 'main'];
    let content = null;
    let successBranch = null;
    let lastError = null;

    for (const b of branchesToTry) {
      try {
        content = await githubService.getFileContent(owner, repo, path, b);
        successBranch = b;
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (content !== null) {
      return res.json({ success: true, branch: successBranch, content });
    } else {
      return res.status(404).json({
        success: false,
        message: `File not found in branches: ${branchesToTry.join(', ')} for path ${path}`,
        error: lastError ? lastError.message : undefined
      });
    }
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