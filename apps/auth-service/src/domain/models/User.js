/**
 * User Model
 * Defines the User entity for authentication and authorization
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  
  // Authentication
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  passwordHistory: [{
    password: String,
    changedAt: Date
  }],
  passwordLastChangedAt: {
    type: Date,
    default: Date.now
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockedUntil: {
    type: Date
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  
  // Verification
  verificationToken: String,
  verificationTokenExpires: Date,
  
  // Password Reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Role-Based Access Control
  role: {
    type: String,
    enum: ['admin', 'manager', 'courier', 'driver', 'collector', 'warehouse', 'customer'],
    default: 'customer'
  },
  permissions: [String],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: Date
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

/**
 * Pre-save hook to hash password before saving
 */
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    
    // Add to password history
    if (!this.passwordHistory) {
      this.passwordHistory = [];
    }
    
    this.passwordHistory.push({
      password: this.password,
      changedAt: new Date()
    });
    
    // Keep only the last 5 passwords in history
    if (this.passwordHistory.length > 5) {
      this.passwordHistory = this.passwordHistory.slice(-5);
    }
    
    this.passwordLastChangedAt = new Date();
    
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare password with hashed password in database
 * @param {string} candidatePassword - The password to compare
 * @returns {Promise<boolean>} - Returns true if passwords match
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check if password exists in password history
 * @param {string} candidatePassword - The password to check
 * @returns {Promise<boolean>} - Returns true if password exists in history
 */
userSchema.methods.isPasswordInHistory = async function(candidatePassword) {
  // Check the last 5 passwords
  for (const historyItem of this.passwordHistory) {
    if (await bcrypt.compare(candidatePassword, historyItem.password)) {
      return true;
    }
  }
  return false;
};

/**
 * Increment failed login attempts
 * @returns {Promise<void>}
 */
userSchema.methods.incrementFailedLoginAttempts = async function() {
  this.failedLoginAttempts += 1;
  
  // Lock account after 5 failed attempts
  if (this.failedLoginAttempts >= 5) {
    this.isLocked = true;
    this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
  }
  
  await this.save();
};

/**
 * Reset failed login attempts
 * @returns {Promise<void>}
 */
userSchema.methods.resetFailedLoginAttempts = async function() {
  this.failedLoginAttempts = 0;
  this.isLocked = false;
  this.lockedUntil = null;
  
  await this.save();
};

/**
 * Update last login timestamp
 * @returns {Promise<void>}
 */
userSchema.methods.updateLastLogin = async function() {
  this.lastLoginAt = new Date();
  await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
