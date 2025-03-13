import { Request, Response } from 'express';
import Event, { IEvent, LegacyEventType, EventStatus } from '../models/Event';
import EventType from '../models/EventType';
import mongoose from 'mongoose';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '../types/apiResponse';

// Extend the Express Request type to include user property
interface AuthRequest extends Request {
  user?: any; // Using any type to match how it's attached in the auth middleware
}

// Get all events for a church
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { churchId } = req.params;
    const { month, year, type, status } = req.query;
    
    console.log('getEvents called with params:', { churchId, month, year, type, status });
    
    // Convert churchId string to ObjectId
    const churchObjectId = new mongoose.Types.ObjectId(churchId);
    
    // Build query
    const query: any = { churchId: churchObjectId };
    
    // Filter by month and year if provided
    if (month && year) {
      const monthNum = parseInt(month as string);
      const yearNum = parseInt(year as string);
      
      // Create start date (first day of month)
      // Client sends month as 1-12, so we need to subtract 1 for JavaScript Date (0-11)
      const startDate = new Date(yearNum, monthNum - 1, 1, 0, 0, 0);
      
      // Create end date (last day of month)
      // Get the last day of the current month
      const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);
      
      query.date = { $gte: startDate, $lte: endDate };
      console.log('Date range filter:', { 
        startDate: startDate.toISOString(), 
        endDate: endDate.toISOString() 
      });
    }
    
    // Filter by type if provided
    if (type) {
      query.type = type;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    console.log('MongoDB query:', JSON.stringify(query));
    
    // Populate the eventTypeId field with event type information
    const events = await Event.find(query)
      .populate('eventTypeId', 'name code color icon')
      .sort({ date: 1 });
    
    console.log('Events found:', events.length);
    
    res.status(200).json(createSuccessResponse(events, undefined, events.length));
  } catch (error) {
    console.error('Error getting events:', error);
    res.status(500).json(createErrorResponse('Server Error', []));
  }
};

// Get a single event
export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(createErrorResponse('Invalid event ID', null));
    }
    
    const event = await Event.findById(id).populate('eventTypeId', 'name code color icon');
    
    if (!event) {
      return res.status(404).json(createErrorResponse('Event not found', null));
    }
    
    res.status(200).json(createSuccessResponse(event));
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json(createErrorResponse('Server Error', null));
  }
};

// Create a new event
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { churchId } = req.params;
    const userId = req.user?._id;
    
    console.log('createEvent called with params:', { churchId, userId });
    console.log('Request body:', req.body);
    
    if (!userId) {
      return res.status(401).json(createErrorResponse('User not authenticated', null));
    }
    
    // Convert churchId string to ObjectId
    const churchObjectId = new mongoose.Types.ObjectId(churchId);
    
    // Create event with church and user IDs
    const eventData = {
      ...req.body,
      churchId: churchObjectId,
      createdBy: userId
    };
    
    console.log('Creating event with data:', eventData);
    
    const event = await Event.create(eventData);
    
    console.log('Event created successfully:', event);
    
    res.status(201).json(createSuccessResponse(event));
  } catch (error) {
    console.error('Error creating event:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map((val: any) => val.message);
      
      return res.status(400).json(createErrorResponse(messages.join(', '), null));
    }
    
    res.status(500).json(createErrorResponse('Server Error', null));
  }
};

// Update an event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(createErrorResponse('Invalid event ID', null));
    }
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json(createErrorResponse('Event not found', null));
    }
    
    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(createSuccessResponse(updatedEvent!));
  } catch (error) {
    console.error('Error updating event:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map((val: any) => val.message);
      
      return res.status(400).json(createErrorResponse(messages.join(', '), null));
    }
    
    res.status(500).json(createErrorResponse('Server Error', null));
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(createErrorResponse('Invalid event ID', null));
    }
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json(createErrorResponse('Event not found', null));
    }
    
    await Event.findByIdAndDelete(id);
    
    res.status(200).json(createSuccessResponse(null, 'Event deleted successfully'));
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json(createErrorResponse('Server Error', null));
  }
};

// Seed events (for development/testing)
export const seedEvents = async (req: AuthRequest, res: Response) => {
  try {
    const { churchId } = req.params;
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json(createErrorResponse('User not authenticated', []));
    }
    
    // Convert churchId string to ObjectId
    const churchObjectId = new mongoose.Types.ObjectId(churchId);
    
    // Get current date info
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Get event types for this church
    const eventTypes = await EventType.find({ churchId: churchObjectId });
    
    if (eventTypes.length === 0) {
      return res.status(400).json(createErrorResponse('No event types found. Please create event types first.', []));
    }
    
    // Create a map of legacy types to event type IDs
    const typeMap: Record<string, mongoose.Types.ObjectId> = {};
    
    // Map legacy types to event type IDs based on code
    eventTypes.forEach(eventType => {
      if (eventType.code === 'service') {
        typeMap['service'] = eventType._id;
      } else if (eventType.code === 'rehearsal') {
        typeMap['rehearsal'] = eventType._id;
      } else if (eventType.code === 'meeting') {
        typeMap['meeting'] = eventType._id;
      } else if (eventType.code === 'youth') {
        typeMap['youth'] = eventType._id;
      }
    });
    
    // If we don't have all the required event types, use the first one as default
    const defaultEventTypeId = eventTypes[0]._id;
    
    // Sample events for March 2025
    const march2025Events = [
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 2, 9, 0), // March 2, 2025
        time: '9:00 AM - 11:00 AM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType, // Keep legacy type for backward compatibility
        status: 'published' as EventStatus,
        description: 'Regular Sunday worship service with communion.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Evening Service',
        date: new Date(2025, 2, 2, 18, 0), // March 2, 2025 Evening
        time: '6:00 PM - 7:30 PM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Evening worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Worship Practice',
        date: new Date(2025, 2, 4, 18, 0), // March 4, 2025
        time: '6:00 PM - 8:00 PM',
        eventTypeId: typeMap['rehearsal'] || defaultEventTypeId,
        type: 'rehearsal' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Weekly worship team practice for upcoming Sunday service.',
        location: 'Worship Room',
        organizer: 'Worship Leader',
        attendees: ['Worship Team', 'Tech Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Youth Group',
        date: new Date(2025, 2, 7, 19, 0), // March 7, 2025
        time: '7:00 PM - 9:00 PM',
        eventTypeId: typeMap['youth'] || defaultEventTypeId,
        type: 'youth' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Weekly youth group meeting with games, worship, and Bible study.',
        location: 'Youth Room',
        organizer: 'Youth Pastor',
        attendees: ['Youth Team', 'Volunteers'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 9, 9, 0), // March 9, 2025
        time: '9:00 AM - 11:00 AM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Regular Sunday worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Evening Service',
        date: new Date(2025, 2, 9, 18, 0), // March 9, 2025 Evening
        time: '6:00 PM - 7:30 PM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Evening worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Leadership Meeting',
        date: new Date(2025, 2, 15, 12, 0), // March 15, 2025
        time: '12:00 PM - 2:00 PM',
        eventTypeId: typeMap['meeting'] || defaultEventTypeId,
        type: 'meeting' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Monthly leadership team meeting to discuss church vision and upcoming events.',
        location: 'Conference Room',
        organizer: 'Senior Pastor',
        attendees: ['Leadership Team', 'Ministry Leaders'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 16, 9, 0), // March 16, 2025
        time: '9:00 AM - 11:00 AM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Regular Sunday worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Evening Service',
        date: new Date(2025, 2, 16, 18, 0), // March 16, 2025 Evening
        time: '6:00 PM - 7:30 PM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Evening worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 23, 9, 0), // March 23, 2025
        time: '9:00 AM - 11:00 AM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Regular Sunday worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Evening Service',
        date: new Date(2025, 2, 23, 18, 0), // March 23, 2025 Evening
        time: '6:00 PM - 7:30 PM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Evening worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 30, 9, 0), // March 30, 2025
        time: '9:00 AM - 11:00 AM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Regular Sunday worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Evening Service',
        date: new Date(2025, 2, 30, 18, 0), // March 30, 2025 Evening
        time: '6:00 PM - 7:30 PM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Evening worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      }
    ];
    
    // Sample events for current month
    const currentMonthEvents = [
      {
        title: 'Sunday Service',
        date: new Date(currentYear, currentMonth, 1, 9, 0), // First Sunday of current month
        time: '9:00 AM - 11:00 AM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Regular Sunday worship service with communion.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Worship Practice',
        date: new Date(currentYear, currentMonth, 3, 18, 0), // Wednesday of first week
        time: '6:00 PM - 8:00 PM',
        eventTypeId: typeMap['rehearsal'] || defaultEventTypeId,
        type: 'rehearsal' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Weekly worship team practice for upcoming Sunday service.',
        location: 'Worship Room',
        organizer: 'Worship Leader',
        attendees: ['Worship Team', 'Tech Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Youth Group',
        date: new Date(currentYear, currentMonth, 5, 19, 0), // Friday of first week
        time: '7:00 PM - 9:00 PM',
        eventTypeId: typeMap['youth'] || defaultEventTypeId,
        type: 'youth' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Weekly youth group meeting with games, worship, and Bible study.',
        location: 'Youth Room',
        organizer: 'Youth Pastor',
        attendees: ['Youth Team', 'Volunteers'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Service',
        date: new Date(currentYear, currentMonth, 8, 9, 0), // Second Sunday
        time: '9:00 AM - 11:00 AM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Regular Sunday worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Leadership Meeting',
        date: new Date(currentYear, currentMonth, 14, 12, 0), // Second Saturday
        time: '12:00 PM - 2:00 PM',
        eventTypeId: typeMap['meeting'] || defaultEventTypeId,
        type: 'meeting' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Monthly leadership team meeting to discuss church vision and upcoming events.',
        location: 'Conference Room',
        organizer: 'Senior Pastor',
        attendees: ['Leadership Team', 'Ministry Leaders'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Service',
        date: new Date(currentYear, currentMonth, 15, 9, 0), // Third Sunday
        time: '9:00 AM - 11:00 AM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Regular Sunday worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Service',
        date: new Date(currentYear, currentMonth, 22, 9, 0), // Fourth Sunday
        time: '9:00 AM - 11:00 AM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Regular Sunday worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Service',
        date: new Date(currentYear, currentMonth, 29, 9, 0), // Fifth Sunday (if exists)
        time: '9:00 AM - 11:00 AM',
        eventTypeId: typeMap['service'] || defaultEventTypeId,
        type: 'service' as LegacyEventType,
        status: 'published' as EventStatus,
        description: 'Regular Sunday worship service.',
        location: 'Main Sanctuary',
        organizer: 'Pastor Johnson',
        attendees: ['Worship Team', 'Tech Team', 'Hospitality Team'],
        churchId: churchObjectId,
        createdBy: userId
      }
    ];
    
    // Combine all events
    const allEvents = [...march2025Events, ...currentMonthEvents];
    
    // Delete existing events for this church
    await Event.deleteMany({
      churchId: churchObjectId
    });
    
    // Create new events
    const events = await Event.insertMany(allEvents);
    
    // Convert to response format
    const responseData = events.map(event => event.toJSON());
    
    res.status(201).json(createSuccessResponse(
      responseData, 
      'Sample events created successfully', 
      events.length
    ));
  } catch (error) {
    console.error('Error seeding events:', error);
    res.status(500).json(createErrorResponse('Server Error', []));
  }
}; 