const express = require('express');
const router = express.Router();
const commitController = require('../controllers/commitController');

router.get('/:owner/:repo/activity', commitController.getRepoCommitActivity);

module.exports = router;
