const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
exports.auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is an admin
exports.admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized as an admin' });
  }

  next();
};

// Middleware to check if user is a leader or admin
exports.leader = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role !== 'leader' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized as a leader' });
  }

  next();
};

// Middleware to check if user belongs to a specific church
exports.churchMember = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // In a real application, we would check if the user belongs to the church
  // For this example, we'll just pass through
  next();
};

// Middleware to check if user has permission to access a specific resource
exports.resourceAccess = (resourceType) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // In a real application, we would check if the user has permission to access the resource
    // For this example, we'll just pass through
    next();
  };
}; 