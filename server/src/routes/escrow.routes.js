const express = require('express');
const router = express.Router();
const escrowController = require('../controllers/escrow.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/stripe/create-intent', authenticateToken, escrowController.createStripeIntent);

module.exports = router;
