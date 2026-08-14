const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'rentra_super_secret_jwt_key_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    
    try {
      const dbUser = await User.findById(decoded.id);
      if (!dbUser) {
        return res.status(401).json({ error: 'User account no longer exists' });
      }
      if (dbUser.status === 'Suspended') {
        return res.status(403).json({ error: 'User account is suspended' });
      }
      
      // Attach the same payload structure that the controllers expect
      req.user = { id: dbUser._id.toString(), email: dbUser.email, role: dbUser.role };
      next();
    } catch (dbErr) {
      return res.status(500).json({ error: 'Authentication database error' });
    }
  });
}

module.exports = { authenticateToken, JWT_SECRET };
