const axios = require('axios');
const githubService = require('../services/githubService');

exports.askAI = async (req, res, next) => {
  try {
    const { prompt, content } = req.body;
    const response = await axios.post('http://localhost:5001/analyze', {
      prompt,
      content,
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
};


exports.askAIAboutFile = async (req, res, next) => {
  try {
    const { owner, repo, path, branch = 'main', prompt } = req.query;

    if (!owner || !repo || !path || !prompt) {
      return res.status(400).json({ message: 'owner, repo, path, and prompt are required' });
    }

    // 1. Get file content
    const content = await githubService.getFileContent(owner, repo, path, branch);

    // 2. Send POST to AI backend
    const aiResponse = await axios.post('http://localhost:5001/generic-prompt', {
      prompt,
      content,
    });

    // 3. Return AI response to frontend
    res.json({ success: true, response: aiResponse.data });

  } catch (err) {
    next(err); // Or res.status(500).json({ message: 'Error', error: err.message });
  }
};