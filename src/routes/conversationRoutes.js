const express = require('express');
const router = express.Router();
const {
  receivePolicy,
  runQuery,
  cleanupConversation,
} = require('../controllers/conversationController');

router.post('/receivePolicy', receivePolicy);
router.post('/runQuery', runQuery);
router.post('/cleanupConversation', cleanupConversation);

module.exports = router;
