const { validationResult } = require('express-validator');

// Mock church data (replace with database in production)
const churches = [
  {
    id: '1',
    name: 'Grace Community Church',
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA'
    },
    phone: '555-123-4567',
    email: 'info@gracecommunity.org',
    website: 'https://www.gracecommunity.org',
    timezone: 'America/Chicago',
    logo: '/default-church-logo.png',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    description: 'A welcoming community of believers dedicated to serving Christ and our neighbors.',
    serviceSchedule: [
      {
        day: 'Sunday',
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        name: 'Sunday Morning Worship',
        description: 'Our main worship service with music, prayer, and teaching.'
      },
      {
        day: 'Wednesday',
        startTime: '7:00 PM',
        endTime: '8:30 PM',
        name: 'Midweek Bible Study',
        description: 'In-depth Bible study and prayer.'
      }
    ],
    ministries: [
      {
        name: 'Worship Ministry',
        description: 'Leading the congregation in worship through music.',
        leader: '2' // User ID
      },
      {
        name: 'Children\'s Ministry',
        description: 'Providing spiritual education and care for children.',
        leader: '3' // User ID
      }
    ],
    subscription: {
      plan: 'basic',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      status: 'active'
    },
    settings: {
      notificationPreferences: {
        emailNotifications: true,
        smsNotifications: false,
        reminderDays: 2
      },
      privacySettings: {
        shareChurchInfo: true,
        publicDirectory: false,
        dataRetentionPeriod: 365
      }
    },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

// @desc    Get all churches (admin only)
// @route   GET /api/churches
// @access  Private/Admin
exports.getChurches = async (req, res) => {
  try {
    res.json(churches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get church by ID
// @route   GET /api/churches/:id
// @access  Private
exports.getChurchById = async (req, res) => {
  try {
    const church = churches.find(church => church.id === req.params.id);
    
    if (!church) {
      return res.status(404).json({ message: 'Church not found' });
    }

    res.json(church);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Create a church
// @route   POST /api/churches
// @access  Private
exports.createChurch = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    address,
    phone,
    email,
    website,
    timezone,
    description
  } = req.body;

  try {
    // Create new church
    const newChurch = {
      id: Date.now().toString(),
      name,
      address,
      phone,
      email,
      website,
      timezone: timezone || 'America/New_York',
      logo: '/default-church-logo.png',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      description,
      serviceSchedule: [],
      ministries: [],
      subscription: {
        plan: 'free',
        startDate: new Date(),
        status: 'active'
      },
      settings: {
        notificationPreferences: {
          emailNotifications: true,
          smsNotifications: false,
          reminderDays: 2
        },
        privacySettings: {
          shareChurchInfo: true,
          publicDirectory: false,
          dataRetentionPeriod: 365
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock database
    churches.push(newChurch);

    res.status(201).json(newChurch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update church
// @route   PUT /api/churches/:id
// @access  Private
exports.updateChurch = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    address,
    phone,
    email,
    website,
    timezone,
    logo,
    primaryColor,
    secondaryColor,
    description
  } = req.body;

  try {
    const church = churches.find(church => church.id === req.params.id);
    
    if (!church) {
      return res.status(404).json({ message: 'Church not found' });
    }

    // Update church fields
    if (name) church.name = name;
    if (address) church.address = address;
    if (phone) church.phone = phone;
    if (email) church.email = email;
    if (website) church.website = website;
    if (timezone) church.timezone = timezone;
    if (logo) church.logo = logo;
    if (primaryColor) church.primaryColor = primaryColor;
    if (secondaryColor) church.secondaryColor = secondaryColor;
    if (description) church.description = description;

    church.updatedAt = new Date();

    res.json(church);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete church
// @route   DELETE /api/churches/:id
// @access  Private/Admin
exports.deleteChurch = async (req, res) => {
  try {
    const churchIndex = churches.findIndex(church => church.id === req.params.id);
    
    if (churchIndex === -1) {
      return res.status(404).json({ message: 'Church not found' });
    }

    // Remove from mock database
    churches.splice(churchIndex, 1);

    res.json({ message: 'Church removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update church service schedule
// @route   PUT /api/churches/:id/service-schedule
// @access  Private
exports.updateServiceSchedule = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { serviceSchedule } = req.body;

  try {
    const church = churches.find(church => church.id === req.params.id);
    
    if (!church) {
      return res.status(404).json({ message: 'Church not found' });
    }

    church.serviceSchedule = serviceSchedule;
    church.updatedAt = new Date();

    res.json(church);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update church ministries
// @route   PUT /api/churches/:id/ministries
// @access  Private
exports.updateMinistries = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { ministries } = req.body;

  try {
    const church = churches.find(church => church.id === req.params.id);
    
    if (!church) {
      return res.status(404).json({ message: 'Church not found' });
    }

    church.ministries = ministries;
    church.updatedAt = new Date();

    res.json(church);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update church settings
// @route   PUT /api/churches/:id/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { notificationPreferences, privacySettings } = req.body;

  try {
    const church = churches.find(church => church.id === req.params.id);
    
    if (!church) {
      return res.status(404).json({ message: 'Church not found' });
    }

    // Update settings
    if (notificationPreferences) {
      church.settings.notificationPreferences = {
        ...church.settings.notificationPreferences,
        ...notificationPreferences
      };
    }

    if (privacySettings) {
      church.settings.privacySettings = {
        ...church.settings.privacySettings,
        ...privacySettings
      };
    }

    church.updatedAt = new Date();

    res.json(church);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 