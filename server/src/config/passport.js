const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
      callbackURL: '/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const avatar = profile.photos[0]?.value;
        
        // Use a state parameter to determine the requested role ('CUSTOMER' or 'OWNER')
        const requestedRole = req.query.state === 'owner' ? 'OWNER' : 'CUSTOMER';

        let user = await User.findOne({ email });

        if (user) {
          let updated = false;
          // If the user already exists, and they requested OWNER, upgrade them if they are CUSTOMER
          if (requestedRole === 'OWNER' && user.role === 'CUSTOMER') {
            user.role = 'OWNER';
            updated = true;
          }
          // Update missing phone or avatar if provided by Google
          if (!user.phone || user.phone === '') {
            user.phone = 'Not Provided';
            updated = true;
          }
          if (avatar && (user.avatar === 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' || !user.avatar)) {
            user.avatar = avatar;
            updated = true;
          }
          
          if (updated) {
            await user.save();
          }
          user._isNewUser = false;
          return done(null, user);
        }

        // If the user doesn't exist, create a new one
        // Generate a random password since they logged in via Google
        const randomPassword = Math.random().toString(36).slice(-10);
        const passwordHash = await bcrypt.hash(randomPassword, 10);

        user = await User.create({
          name,
          email,
          phone: 'Not Provided', // Fixed number fallback requested by user
          passwordHash,
          role: requestedRole,
          avatar: avatar || undefined,
          isVerified: true,
          isFirstLogin: true,
          authProvider: 'google',
        });
        user._isNewUser = true;

        // Add welcome notification
        const Notification = require('../models/notification.model');
        const notif = await Notification.create({
          userId: user._id,
          title: 'Welcome to Rentra!',
          message: `Hi ${name}, welcome to the platform. ${user.role === 'OWNER' ? 'Complete your business profile to get started.' : 'Explore and rent heavy equipment today!'}`,
          type: 'Welcome',
        });
        const io = req.app ? req.app.get('io') : null;
        if (io) {
          io.to(`user_${user._id}`).emit('notification', {
            id: notif._id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            timestamp: notif.createdAt,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// We don't strictly need serialize/deserialize if we just issue a JWT immediately, 
// but passport requires them to avoid errors in some setups.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
