const express = require('express');
const router = express.Router();
const contributorController = require('../controllers/contributorController');

router.get('/:owner/:repo', contributorController.getContributors);

module.exports = router;
