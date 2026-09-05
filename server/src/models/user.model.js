const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: ['CUSTOMER', 'OWNER', 'ADMIN'],
      default: 'CUSTOMER',
    },
    phone: {
      type: String,
      default: '',
    },
    // Admin can suspend users
    status: {
      type: String,
      enum: ['Active', 'Suspended'],
      default: 'Active',
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    },
    cover: {
      type: String,
      default: 'https://i.pinimg.com/1200x/23/0f/87/230f876b35c23faffb3f34b2ac4b6c50.jpg',
    },
    companyName: { type: String, default: '' },
    businessType: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment'
    }],
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        // Never expose password hash in JSON responses
        delete ret.passwordHash;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
