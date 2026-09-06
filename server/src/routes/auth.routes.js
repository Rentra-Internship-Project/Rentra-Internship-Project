const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticateToken, authController.getProfile);
router.put('/me', authenticateToken, authController.updateProfile);
router.put('/me/password', authenticateToken, authController.updatePassword);
router.put('/switch-role', authenticateToken, authController.switchRole);
router.post('/wishlist', authenticateToken, authController.toggleWishlist);
router.get('/wishlist', authenticateToken, authController.getWishlist);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Google OAuth routes
// Capture the role from query params (e.g. /api/auth/google?role=owner) and pass it as state
router.get('/google', (req, res, next) => {
  const role = req.query.role === 'owner' ? 'owner' : 'customer';
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: role,
  })(req, res, next);
});

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/login?error=oauth_failed` }),
  (req, res) => {
    // Successful authentication, generate JWT
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    const isNew = req.user._isNewUser ? 'true' : 'false';
    // Redirect back to frontend with token
    res.redirect(`${CLIENT_URL}/oauth-callback?token=${token}&role=${req.user.role}&isNew=${isNew}`);
  }
);

module.exports = router;
