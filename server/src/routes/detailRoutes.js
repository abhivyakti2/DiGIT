const express = require('express');
const router = express.Router();
const detailController = require('../controllers/detailController');

router.get('/:owner/:repo', detailController.getRepoDetails);

module.exports = router;
