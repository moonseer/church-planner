import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Ensure JWT_SECRET is set
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET environment variable is not set!');
    throw new Error('JWT_SECRET environment variable is not set. This is a critical security issue.');
  }
  return secret;
};

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in cookies first (preferred method)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // Fallback to Authorization header for backward compatibility
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      res.status(401).json({ success: false, message: 'Not authorized to access this route' });
      return;
    }

    try {
      // Get JWT secret and verify token
      const jwtSecret = getJwtSecret();
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      // Find user by id
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(401).json({ success: false, message: 'User not found' });
        return;
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof Error && error.name === 'JsonWebTokenError') {
        res.status(401).json({ success: false, message: 'Invalid token' });
      } else if (error instanceof Error && error.name === 'TokenExpiredError') {
        res.status(401).json({ success: false, message: 'Token expired' });
      } else {
        res.status(401).json({ success: false, message: 'Not authorized to access this route' });
      }
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Middleware to check if user has specific role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized to access this route' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Not authorized to access this route' });
      return;
    }

    next();
  };
}; 