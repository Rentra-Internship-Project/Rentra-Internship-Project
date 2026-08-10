const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readLocalDB, writeLocalDB } = require('../../config/db');
const { authenticateToken, JWT_SECRET } = require('../../middleware/auth.middleware');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const db = readLocalDB();

    if (db.users.some((u) => u.email === email)) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password || 'password123', 10);
    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      passwordHash,
      role: role || 'CUSTOMER',
      company: role === 'OWNER' ? 'Titan Machinery Fleet Ltd' : 'Apex Infra Contractors',
    };

    db.users.push(newUser);
    writeLocalDB(db);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readLocalDB();
    const user = db.users.find((u) => u.email === email);

    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

router.get('/me', authenticateToken, (req, res) => {
  const db = readLocalDB();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User profile not found' });
  res.json({ user });
});

module.exports = router;
