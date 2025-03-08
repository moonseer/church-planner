const mongoose = require('mongoose');

const ChurchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'USA'
    }
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  website: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
    required: true,
    default: 'America/New_York'
  },
  logo: {
    type: String,
    default: '/default-church-logo.png'
  },
  primaryColor: {
    type: String,
    default: '#3B82F6' // Primary blue from our color scheme
  },
  secondaryColor: {
    type: String,
    default: '#10B981' // Secondary green from our color scheme
  },
  description: {
    type: String,
    trim: true
  },
  serviceSchedule: [{
    day: {
      type: String,
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  ministries: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'trial'],
      default: 'active'
    }
  },
  settings: {
    defaultServiceTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceTemplate'
    },
    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      smsNotifications: {
        type: Boolean,
        default: false
      },
      reminderDays: {
        type: Number,
        default: 2
      }
    },
    privacySettings: {
      shareChurchInfo: {
        type: Boolean,
        default: true
      },
      publicDirectory: {
        type: Boolean,
        default: false
      },
      dataRetentionPeriod: {
        type: Number,
        default: 365 // days
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ChurchSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Church', ChurchSchema); 