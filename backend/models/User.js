const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userPermissionsSchema = new mongoose.Schema({
  canCreateIssues: { type: Boolean, default: false },
  canEditIssues: { type: Boolean, default: false },
  canDeleteIssues: { type: Boolean, default: false },
  canAssignIssues: { type: Boolean, default: false },
  canViewAllIssues: { type: Boolean, default: false },
  canManageUsers: { type: Boolean, default: false },
  canViewReports: { type: Boolean, default: false },
  canExportData: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
    // Note: unique removed - will use compound index with company
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'developer', 'qa', 'viewer'],
    default: 'viewer'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  permissions: {
    type: userPermissionsSchema,
    default: {}
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  avatar: {
    type: String,
    default: ''
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index: Email must be unique per company
// Same email can exist in different companies
userSchema.index({ email: 1, company: 1 }, { unique: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);