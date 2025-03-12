import { Request, Response } from 'express';
import Event, { IEvent } from '../models/Event';
import mongoose from 'mongoose';

// Extend the Express Request type to include user property
interface AuthRequest extends Request {
  user?: any; // Using any type to match how it's attached in the auth middleware
}

// Get all events for a church
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { churchId } = req.params;
    const { month, year, type, status } = req.query;
    
    // Build query
    const query: any = { churchId };
    
    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
      const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    // Filter by type if provided
    if (type) {
      query.type = type;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    const events = await Event.find(query).sort({ date: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get a single event
export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID'
      });
    }
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create a new event
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { churchId } = req.params;
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }
    
    // Create event with church and user IDs
    const eventData = {
      ...req.body,
      churchId,
      createdBy: userId
    };
    
    const event = await Event.create(eventData);
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map((val: any) => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update an event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID'
      });
    }
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map((val: any) => val.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID'
      });
    }
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    await Event.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Seed events (for development/testing)
export const seedEvents = async (req: AuthRequest, res: Response) => {
  try {
    const { churchId } = req.params;
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }
    
    // Sample events for March 2025
    const sampleEvents = [
      {
        title: 'Sunday Service',
        date: new Date(2025, 2, 2, 9, 0), // March 2, 2025
        time: '9:00 AM - 11:00 AM',
        type: 'service',
        status: 'published',
        description: 'Regular Sunday worship service with communion.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId,
        createdBy: userId
      },
      {
        title: 'Worship Practice',
        date: new Date(2025, 2, 4, 18, 0), // March 4, 2025
        time: '6:00 PM - 8:00 PM',
        type: 'rehearsal',
        status: 'draft',
        description: 'Weekly worship team rehearsal for upcoming Sunday service.',
        location: 'Worship Room',
        organizer: 'Worship Leader',
        attendees: ['Vocalists', 'Band Members', 'Sound Engineer'],
        churchId,
        createdBy: userId
      },
      {
        title: 'Youth Group',
        date: new Date(2025, 2, 7, 19, 0), // March 7, 2025
        time: '7:00 PM - 9:00 PM',
        type: 'youth',
        status: 'draft',
        description: 'Weekly youth group meeting with games, worship, and Bible study.',
        location: 'Youth Room',
        organizer: 'Youth Pastor',
        attendees: ['Youth Leaders', 'Students'],
        churchId,
        createdBy: userId
      },
      {
        title: 'Leadership Meeting',
        date: new Date(2025, 2, 15, 12, 0), // March 15, 2025
        time: '12:00 PM - 1:30 PM',
        type: 'meeting',
        status: 'published',
        description: 'Monthly leadership team meeting to discuss church vision and upcoming events.',
        location: 'Conference Room',
        organizer: 'Senior Pastor',
        attendees: ['Elders', 'Ministry Leaders', 'Staff'],
        churchId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 9, 9, 0), // March 9, 2025
        time: '9:00 AM - 11:00 AM',
        type: 'service',
        status: 'draft',
        description: 'Regular Sunday morning worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Team A', 'Tech Team', 'Hospitality Team'],
        churchId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 16, 9, 0), // March 16, 2025
        time: '9:00 AM - 11:00 AM',
        type: 'service',
        status: 'published',
        description: 'Regular Sunday morning worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Team B', 'Tech Team', 'Hospitality Team'],
        churchId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 23, 9, 0), // March 23, 2025
        time: '9:00 AM - 11:00 AM',
        type: 'service',
        status: 'draft',
        description: 'Regular Sunday morning worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Team C', 'Tech Team', 'Hospitality Team'],
        churchId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 30, 9, 0), // March 30, 2025
        time: '9:00 AM - 11:00 AM',
        type: 'service',
        status: 'draft',
        description: 'Regular Sunday morning worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Team D', 'Tech Team', 'Hospitality Team'],
        churchId,
        createdBy: userId
      }
    ];
    
    // Clear existing events for this church
    await Event.deleteMany({ churchId });
    
    // Insert sample events
    const events = await Event.insertMany(sampleEvents);
    
    res.status(201).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error seeding events:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 