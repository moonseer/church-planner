import { Request, Response } from 'express';
import mongoose from 'mongoose';
import EventType, { IEventType } from '../models/EventType';
import Event from '../models/Event';

// Extend the Express Request type to include user property
interface AuthRequest extends Request {
  user?: any; // Using any type to match how it's attached in the auth middleware
}

/**
 * @desc    Get all event types for a church
 * @route   GET /api/event-types
 * @access  Private
 */
export const getEventTypes = async (req: AuthRequest, res: Response) => {
  try {
    console.log('getEventTypes called with params:', req.params);
    console.log('User from request:', req.user);
    
    // Get churchId from params or from user object
    let churchId: string | undefined = req.params.churchId;
    
    // If churchId is not in params, try to get it from user object
    if (!churchId && req.user && req.user._id) {
      churchId = req.user._id.toString();
    }
    
    console.log('Resolved churchId:', churchId);
    
    if (!churchId) {
      return res.status(400).json({
        success: false,
        message: 'Church ID is required'
      });
    }

    // Convert churchId to ObjectId
    const churchObjectId = new mongoose.Types.ObjectId(churchId);

    const eventTypes = await EventType.find({ churchId: churchObjectId })
      .sort({ isDefault: -1, name: 1 }) // Default types first, then alphabetical
      .select('name code color icon isDefault');
    
    console.log('Event types found:', eventTypes.length);
    
    res.status(200).json({
      success: true,
      count: eventTypes.length,
      data: eventTypes
    });
  } catch (error: any) {
    console.error('Error fetching event types:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event types'
    });
  }
};

/**
 * @desc    Get a single event type
 * @route   GET /api/event-types/:id
 * @access  Private
 */
export const getEventType = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const churchId = req.params.churchId || (req.user && req.user._id);
    
    if (!churchId) {
      return res.status(400).json({
        success: false,
        message: 'Church ID is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event type ID'
      });
    }

    const eventType = await EventType.findOne({ 
      _id: id,
      churchId
    }).select('name code color icon isDefault');

    if (!eventType) {
      return res.status(404).json({
        success: false,
        message: 'Event type not found'
      });
    }

    res.status(200).json({
      success: true,
      data: eventType
    });
  } catch (error: any) {
    console.error('Error fetching event type:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event type'
    });
  }
};

/**
 * @desc    Create a new event type
 * @route   POST /api/event-types
 * @access  Private
 */
export const createEventType = async (req: AuthRequest, res: Response) => {
  try {
    const churchId = req.params.churchId || (req.user && req.user._id);
    const userId = req.user && req.user._id;
    
    if (!churchId) {
      return res.status(400).json({
        success: false,
        message: 'Church ID is required'
      });
    }
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Create event type with church and user IDs
    const eventTypeData = {
      ...req.body,
      churchId,
      createdBy: userId
    };

    const eventType = await EventType.create(eventTypeData);

    res.status(201).json({
      success: true,
      data: eventType
    });
  } catch (error: any) {
    console.error('Error creating event type:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    } else if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Event type with this code already exists for this church'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating event type'
    });
  }
};

/**
 * @desc    Update an event type
 * @route   PUT /api/event-types/:id
 * @access  Private
 */
export const updateEventType = async (req: AuthRequest, res: Response) => {
  try {
    const eventTypeId = req.params.id;
    const { name, color, icon } = req.body;
    const churchId = req.params.churchId || (req.user && req.user._id);
    
    if (!churchId) {
      return res.status(400).json({
        success: false,
        message: 'Church ID is required'
      });
    }
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventTypeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event type ID format'
      });
    }
    
    // Find the event type
    const eventType = await EventType.findOne({
      _id: eventTypeId,
      churchId
    });
    
    if (!eventType) {
      return res.status(404).json({
        success: false,
        message: 'Event type not found'
      });
    }
    
    // Prevent modification of default event types' code
    if (eventType.isDefault && req.body.code && req.body.code !== eventType.code) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change the code of default event types'
      });
    }
    
    // Update fields
    const updateData: Partial<IEventType> = {};
    if (name) updateData.name = name;
    if (color) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;
    if (req.body.code && !eventType.isDefault) updateData.code = req.body.code;
    
    const updatedEventType = await EventType.findByIdAndUpdate(
      eventTypeId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedEventType
    });
  } catch (error: any) {
    console.error('Error updating event type:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    } else if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Event type with this code already exists for this church'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating event type'
    });
  }
};

/**
 * @desc    Delete an event type
 * @route   DELETE /api/event-types/:id
 * @access  Private
 */
export const deleteEventType = async (req: AuthRequest, res: Response) => {
  try {
    const eventTypeId = req.params.id;
    const churchId = req.params.churchId || (req.user && req.user._id);
    
    if (!churchId) {
      return res.status(400).json({
        success: false,
        message: 'Church ID is required'
      });
    }
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventTypeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event type ID format'
      });
    }
    
    // Find the event type
    const eventType = await EventType.findOne({
      _id: eventTypeId,
      churchId
    });
    
    if (!eventType) {
      return res.status(404).json({
        success: false,
        message: 'Event type not found'
      });
    }
    
    // Prevent deletion of default event types
    if (eventType.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete default event types'
      });
    }
    
    // Check if there are any events using this event type
    const eventsUsingType = await Event.countDocuments({ eventTypeId });
    if (eventsUsingType > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete this event type as it is used by ${eventsUsingType} events. Please reassign these events first.`
      });
    }
    
    // Delete the event type
    await EventType.findByIdAndDelete(eventTypeId);
    
    res.status(200).json({
      success: true,
      message: 'Event type deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting event type:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event type'
    });
  }
};

/**
 * @desc    Seed default event types for a church
 * @route   POST /api/event-types/seed
 * @access  Private
 */
export const seedDefaultEventTypes = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Seeding default event types, request params:', req.params);
    console.log('User from request:', req.user);
    
    // Get churchId from params or from user object
    let churchId: string | undefined = req.params.churchId;
    
    // If churchId is not in params, try to get it from user object
    if (!churchId && req.user && req.user._id) {
      churchId = req.user._id.toString();
    }
    
    // Get userId from user object
    let userId: string | undefined;
    if (req.user && req.user._id) {
      userId = req.user._id.toString();
    }
    
    console.log('Resolved churchId:', churchId);
    console.log('Resolved userId:', userId);
    
    if (!churchId) {
      console.log('Church ID is missing');
      return res.status(400).json({
        success: false,
        message: 'Church ID is required'
      });
    }
    
    if (!userId) {
      console.log('User ID is missing');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    // Convert IDs to ObjectId
    const churchObjectId = new mongoose.Types.ObjectId(churchId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    // Define default event types
    const defaultEventTypes = [
      {
        name: 'Service',
        code: `service-${churchId}`, // Make code unique by including churchId
        color: '#4F46E5', // Indigo
        isDefault: true
      },
      {
        name: 'Rehearsal',
        code: `rehearsal-${churchId}`, // Make code unique by including churchId
        color: '#0EA5E9', // Sky
        isDefault: true
      },
      {
        name: 'Meeting',
        code: `meeting-${churchId}`, // Make code unique by including churchId
        color: '#10B981', // Emerald
        isDefault: true
      },
      {
        name: 'Youth',
        code: `youth-${churchId}`, // Make code unique by including churchId
        color: '#8B5CF6', // Violet
        isDefault: true
      }
    ];
    
    console.log('Default event types to create:', defaultEventTypes);
    
    // Check which default types already exist
    const existingTypes = await EventType.find({ 
      churchId: churchObjectId,
      isDefault: true
    });
    
    console.log('Existing event types:', existingTypes);
    
    const existingCodes = existingTypes.map(type => type.code);
    
    // Filter out existing types
    const typesToCreate = defaultEventTypes.filter(type => !existingCodes.includes(type.code));
    
    console.log('Types to create:', typesToCreate);
    
    // Create missing default types
    if (typesToCreate.length > 0) {
      const eventTypesToInsert = typesToCreate.map(type => ({
        ...type,
        churchId: churchObjectId,
        createdBy: userObjectId
      }));
      
      console.log('Event types to insert:', eventTypesToInsert);
      
      try {
        const createdTypes = await EventType.insertMany(eventTypesToInsert);
        console.log('Created event types:', createdTypes);
      } catch (insertError: any) {
        console.error('Error inserting event types:', insertError);
        
        // If there's an error with insertMany, try inserting one by one
        if (insertError.code === 11000) { // Duplicate key error
          console.log('Duplicate key error, trying to insert one by one');
          
          for (const type of eventTypesToInsert) {
            try {
              await EventType.create(type);
            } catch (singleInsertError) {
              console.error('Error inserting single event type:', singleInsertError);
            }
          }
        }
      }
    }
    
    // Get all event types for the church
    const allEventTypes = await EventType.find({ churchId: churchObjectId })
      .sort({ isDefault: -1, name: 1 });
    
    console.log('All event types after seeding:', allEventTypes);
    
    res.status(200).json({
      success: true,
      message: `${typesToCreate.length} default event types created`,
      data: allEventTypes
    });
  } catch (error: any) {
    console.error('Error seeding default event types:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while seeding default event types'
    });
  }
};

/**
 * @desc    Get event type usage statistics
 * @route   GET /api/event-types/:id/stats
 * @access  Private
 */
export const getEventTypeStats = async (req: AuthRequest, res: Response) => {
  try {
    const eventTypeId = req.params.id;
    const churchId = req.params.churchId || (req.user && req.user._id);
    
    if (!churchId) {
      return res.status(400).json({
        success: false,
        message: 'Church ID is required'
      });
    }
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventTypeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event type ID format'
      });
    }
    
    // Check if event type exists
    const eventType = await EventType.findOne({
      _id: eventTypeId,
      churchId
    });
    
    if (!eventType) {
      return res.status(404).json({
        success: false,
        message: 'Event type not found'
      });
    }
    
    // Get usage statistics
    const totalEvents = await Event.countDocuments({ eventTypeId });
    const upcomingEvents = await Event.countDocuments({
      eventTypeId,
      date: { $gte: new Date() }
    });
    const pastEvents = await Event.countDocuments({
      eventTypeId,
      date: { $lt: new Date() }
    });
    
    // Get most recent events
    const recentEvents = await Event.find({ eventTypeId })
      .sort({ date: -1 })
      .limit(5)
      .select('title date time');
    
    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        pastEvents,
        recentEvents
      }
    });
  } catch (error: any) {
    console.error('Error fetching event type stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event type stats'
    });
  }
}; 