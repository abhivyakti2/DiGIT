const express = require('express');
const router = express.Router();
const repoController = require('../controllers/repoController');


router.get('/search/code', repoController.searchCodeInRepo);
router.get('/search', repoController.searchRepositories);
router.get('/:username', repoController.getUserRepos);
module.exports = router;
