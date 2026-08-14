const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');

// Public route for chatbot
router.post('/', chatController.handleChat);

module.exports = router;
