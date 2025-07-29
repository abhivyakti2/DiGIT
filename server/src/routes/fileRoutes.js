const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');


// router.get('/search/code', repoController.searchCodeInRepo);
router.get('/content', fileController.getFileContent);
router.get('/analyze', fileController.getFileContentAndAskAI);
module.exports = router;
