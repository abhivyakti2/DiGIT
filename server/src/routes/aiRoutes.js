const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// router.post('/ask', aiController.askAI); // Generic endpoint
// router.get('/analyze', aiController.getFileContentAndAskAI);
router.get('/ask', aiController.askAIAboutFile);

module.exports = router;
