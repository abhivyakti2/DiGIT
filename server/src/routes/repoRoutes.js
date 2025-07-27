const express = require('express');
const router = express.Router();
const repoController = require('../controllers/repoController');

router.get('/:username', repoController.getUserRepos);

module.exports = router;
