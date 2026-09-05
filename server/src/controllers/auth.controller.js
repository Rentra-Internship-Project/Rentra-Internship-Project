const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Equipment = require('../models/equipment.model');
const Notification = require('../models/notification.model');
const { JWT_SECRET } = require('../middleware/auth.middleware');

// Helper: create and emit a notification
async function createNotification(io, userId, data) {
  try {
    const notif = await Notification.create({ userId, ...data });
    if (io) {
      io.to(`user_${userId}`).emit('notification', {
        id: notif._id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        timestamp: notif.createdAt,
      });
    }
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
}

exports.register = async (req, res) => {
  try {
    let { name, email, password, role, phone } = req.body;
    name = name ? name.trim() : "";
    email = email ? email.trim().toLowerCase() : "";

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      phone: phone || '',
      passwordHash,
      role: role || 'CUSTOMER',
      // No fake company name — business comes from Business model
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send Welcome Notification
    await createNotification(req.app ? req.app.get('io') : null, newUser._id, {
      title: 'Welcome to Rentra!',
      message: `Hi ${name}, welcome to the platform. ${role === 'OWNER' ? 'Complete your business profile to get started.' : 'Explore and rent heavy equipment today!'}`,
      type: 'Welcome',
    });

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email ? email.trim().toLowerCase() : "";

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user and explicitly select passwordHash (excluded from default toJSON)
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    if (user.status === 'Suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Contact support.' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    // toJSON transform removes passwordHash automatically
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      match: { status: 'Approved', availability: 'Available' },
      select: 'name category pricePerDay image locationAddress availability rating',
    });
    if (!user) return res.status(404).json({ error: 'User profile not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Profile fetch failed', details: err.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { equipmentId } = req.body;
    if (!equipmentId) return res.status(400).json({ error: 'equipmentId is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Use proper ObjectId comparison
    const objectId = new mongoose.Types.ObjectId(equipmentId);
    const existingIndex = user.wishlist.findIndex(
      (id) => id.toString() === objectId.toString()
    );

    if (existingIndex === -1) {
      // Add to wishlist
      user.wishlist.push(objectId);
    } else {
      // Remove from wishlist
      user.wishlist.splice(existingIndex, 1);
    }

    await user.save();
    res.json({ wishlist: user.wishlist, added: existingIndex === -1 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update wishlist', details: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      populate: { path: 'ownerId', select: 'name phone email' },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Filter out deleted/rejected equipment gracefully
    const validWishlist = (user.wishlist || []).filter(item => item && item._id);

    res.json({ wishlist: validWishlist });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist', details: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar, cover, companyName, businessType, address, city, state, zip } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (cover !== undefined) user.cover = cover;
    if (companyName !== undefined) user.companyName = companyName;
    if (businessType !== undefined) user.businessType = businessType;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (zip !== undefined) user.zip = zip;

    await user.save();
    res.json({ user, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    // Hash and update new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newPasswordHash;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password', details: err.message });
  }
};

const crypto = require('crypto');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'No account found with that email' });
    }

    if (user.authProvider === 'google') {
      return res.status(400).json({ error: 'This account uses Google Login. Please sign in with Google.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token and expiry (1 hour)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Since there's no live email service (like Nodemailer) configured in this project,
    // we return the token in the response so the frontend can mock the email flow or developer can test it.
    // In production, you would send an email with a link like: `https://rentra.in/reset-password/${resetToken}`
    const mockResetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    res.json({ 
      message: 'Password reset link generated. Check your email.',
      _dev_note: 'Because email is not configured, here is the token link for testing:',
      resetLink: mockResetUrl,
      resetToken
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to process forgot password request', details: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Hash the token from the request to compare with the one in DB
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() } // Ensure it hasn't expired
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset token' });
    }

    // Hash new password and clear reset fields
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been successfully reset. You can now log in.' });

  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password', details: err.message });
  }
};
