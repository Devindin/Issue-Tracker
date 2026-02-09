const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  severity: {
    type: String,
    enum: ['Minor', 'Major', 'Critical'],
    default: 'Minor'
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Update completedAt when status changes to Resolved or Closed
issueSchema.pre('save', function(next) {
  if (this.isModified('status') && (this.status === 'Resolved' || this.status === 'Closed')) {
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  } else if (this.isModified('status') && this.status !== 'Resolved' && this.status !== 'Closed') {
    this.completedAt = undefined;
  }
  next();
});

module.exports = mongoose.model('Issue', issueSchema);