const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All notification routes require auth
router.get('/', authenticateToken, notificationController.getMyNotifications);
router.put('/:id/read', authenticateToken, notificationController.markRead);
router.put('/read-all', authenticateToken, notificationController.markAllRead);

module.exports = router;
