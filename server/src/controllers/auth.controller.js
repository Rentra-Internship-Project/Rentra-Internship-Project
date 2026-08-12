const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { JWT_SECRET } = require('../middleware/auth.middleware');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password || 'password123', 10);
    const newUser = await User.create({
      name,
      email,
      phone: phone || '',
      passwordHash,
      role: role || 'CUSTOMER',
      company: role === 'OWNER' ? 'Titan Machinery Fleet Ltd' : 'Apex Infra Contractors',
    });

    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User profile not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Profile fetch failed', details: err.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { equipmentId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const index = user.wishlist.indexOf(equipmentId);
    if (index === -1) {
      user.wishlist.push(equipmentId);
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wishlist', details: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, companyName, avatar, cover } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (companyName !== undefined) user.company = companyName;
    if (avatar) user.avatar = avatar;
    if (cover) user.cover = cover;

    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
};
