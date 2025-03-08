const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
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
  role: {
    type: String,
    enum: ['admin', 'leader', 'volunteer'],
    default: 'volunteer'
  },
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Church'
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    default: '/default-profile.png'
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'USA'
    }
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  skills: [{
    type: String,
    trim: true
  }],
  availability: {
    sunday: {
      available: { type: Boolean, default: true },
      timeSlots: [{
        startTime: String,
        endTime: String
      }]
    },
    monday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: String,
        endTime: String
      }]
    },
    tuesday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: String,
        endTime: String
      }]
    },
    wednesday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: String,
        endTime: String
      }]
    },
    thursday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: String,
        endTime: String
      }]
    },
    friday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: String,
        endTime: String
      }]
    },
    saturday: {
      available: { type: Boolean, default: false },
      timeSlots: [{
        startTime: String,
        endTime: String
      }]
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      },
      reminderDays: {
        type: Number,
        default: 2
      }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  privacySettings: {
    showEmail: {
      type: Boolean,
      default: false
    },
    showPhoneNumber: {
      type: Boolean,
      default: false
    },
    showAddress: {
      type: Boolean,
      default: false
    },
    allowNotifications: {
      type: Boolean,
      default: true
    },
    shareAvailability: {
      type: Boolean,
      default: true
    },
    dataRetentionPeriod: {
      type: Number,
      default: 365 // days
    },
    dataProcessingConsent: {
      type: Boolean,
      default: true
    },
    marketingConsent: {
      type: Boolean,
      default: false
    },
    thirdPartySharing: {
      type: Boolean,
      default: false
    },
    lastPrivacyAcceptanceDate: {
      type: Date,
      default: Date.now
    }
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // GDPR data export and deletion tracking
  dataExports: [{
    requestDate: {
      type: Date
    },
    completionDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['requested', 'processing', 'completed', 'failed'],
      default: 'requested'
    }
  }],
  deletionRequests: [{
    requestDate: {
      type: Date
    },
    scheduledDeletionDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['requested', 'scheduled', 'completed', 'cancelled'],
      default: 'requested'
    }
  }]
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

// Method to get public profile (respecting privacy settings)
UserSchema.methods.getPublicProfile = function() {
  const publicProfile = {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    profileImage: this.profileImage,
    role: this.role,
    bio: this.bio,
    skills: this.skills,
    teams: this.teams
  };

  // Add fields based on privacy settings
  if (this.privacySettings.showEmail) {
    publicProfile.email = this.email;
  }

  if (this.privacySettings.showPhoneNumber) {
    publicProfile.phoneNumber = this.phoneNumber;
  }

  if (this.privacySettings.showAddress) {
    publicProfile.address = this.address;
  }

  if (this.privacySettings.shareAvailability) {
    publicProfile.availability = this.availability;
  }

  return publicProfile;
};

// Method to get GDPR data export
UserSchema.methods.getDataExport = function() {
  // Return all user data for GDPR compliance
  return {
    personalInfo: {
      id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      address: this.address,
      profileImage: this.profileImage,
      bio: this.bio,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin
    },
    churchInfo: {
      church: this.church
    },
    teamsAndSkills: {
      teams: this.teams,
      skills: this.skills
    },
    availability: this.availability,
    preferences: this.preferences,
    privacySettings: this.privacySettings,
    dataExports: this.dataExports,
    deletionRequests: this.deletionRequests
  };
};

module.exports = mongoose.model('User', UserSchema); 