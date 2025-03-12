import { Request, Response } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import mongoose from 'mongoose';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '../types/apiResponse';

// Church interfaces
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ServiceSchedule {
  day: string;
  startTime: string;
  endTime: string;
  name: string;
  description: string;
}

interface Ministry {
  name: string;
  description: string;
  leader: string; // User ID
}

interface Church {
  id: string;
  name: string;
  address: Address;
  phone: string;
  email: string;
  website: string;
  timezone: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  serviceSchedule: ServiceSchedule[];
  ministries: Ministry[];
}

// Mock church data (replace with database in production)
const churches: Church[] = [
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
  }
];

// Get all churches
export const getChurches = (req: Request, res: Response) => {
  try {
    res.status(200).json(createSuccessResponse(churches));
  } catch (error) {
    console.error('Error getting churches:', error);
    res.status(500).json(createErrorResponse('Server Error', []));
  }
};

// Get a single church by ID
export const getChurch = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const church = churches.find(c => c.id === id);
    
    if (!church) {
      return res.status(404).json(createErrorResponse('Church not found', null));
    }
    
    res.status(200).json(createSuccessResponse(church));
  } catch (error) {
    console.error('Error getting church:', error);
    res.status(500).json(createErrorResponse('Server Error', null));
  }
};

// Create a new church
export const createChurch = (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        createErrorResponse(
          errors.array().map((err: ValidationError) => err.msg).join(', '), 
          null
        )
      );
    }
    
    // In a real app, you would save to database
    const newChurch: Church = {
      id: (churches.length + 1).toString(),
      ...req.body
    };
    
    churches.push(newChurch);
    
    res.status(201).json(createSuccessResponse(newChurch));
  } catch (error) {
    console.error('Error creating church:', error);
    res.status(500).json(createErrorResponse('Server Error', null));
  }
};

// Update a church
export const updateChurch = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const churchIndex = churches.findIndex(c => c.id === id);
    
    if (churchIndex === -1) {
      return res.status(404).json(createErrorResponse('Church not found', null));
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(
        createErrorResponse(
          errors.array().map((err: ValidationError) => err.msg).join(', '), 
          null
        )
      );
    }
    
    // Update church
    const updatedChurch: Church = {
      ...churches[churchIndex],
      ...req.body,
      id // Ensure ID doesn't change
    };
    
    churches[churchIndex] = updatedChurch;
    
    res.status(200).json(createSuccessResponse(updatedChurch));
  } catch (error) {
    console.error('Error updating church:', error);
    res.status(500).json(createErrorResponse('Server Error', null));
  }
};

// Delete a church
export const deleteChurch = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const churchIndex = churches.findIndex(c => c.id === id);
    
    if (churchIndex === -1) {
      return res.status(404).json(createErrorResponse('Church not found', null));
    }
    
    // Remove church
    churches.splice(churchIndex, 1);
    
    res.status(200).json(createSuccessResponse(null, 'Church deleted successfully'));
  } catch (error) {
    console.error('Error deleting church:', error);
    res.status(500).json(createErrorResponse('Server Error', null));
  }
}; 