const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All business routes require authentication
router.post('/', authenticateToken, businessController.registerBusiness);
router.get('/me', authenticateToken, businessController.getMyBusiness);
router.put('/me', authenticateToken, businessController.updateMyBusiness);

module.exports = router;
