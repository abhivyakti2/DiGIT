const express = require('express');
const router = express.Router();
const treeController = require('../controllers/treeController');
router.get('/tree', treeController.getRepoTree);
module.exports = router;
