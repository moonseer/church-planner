import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - time
 *         - eventTypeId
 *         - status
 *         - churchId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the event
 *         title:
 *           type: string
 *           description: The title of the event
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the event
 *         time:
 *           type: string
 *           description: The time of the event
 *         eventTypeId:
 *           type: string
 *           description: The ID of the event type
 *         type:
 *           type: string
 *           enum: [service, rehearsal, meeting, youth]
 *           description: Legacy event type (for backward compatibility)
 *         status:
 *           type: string
 *           enum: [draft, published, completed]
 *           description: The status of the event
 *         description:
 *           type: string
 *           description: A description of the event
 *         location:
 *           type: string
 *           description: The location of the event
 *         organizer:
 *           type: string
 *           description: The organizer of the event
 *         attendees:
 *           type: array
 *           items:
 *             type: string
 *           description: List of attendees for the event
 *         churchId:
 *           type: string
 *           description: The ID of the church the event belongs to
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the event
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the event was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the event was last updated
 *       example:
 *         id: 60d0fe4f5311236168a109cb
 *         title: Sunday Service
 *         date: 2023-01-15
 *         time: 10:00 AM
 *         eventTypeId: 60d0fe4f5311236168a109cc
 *         status: published
 *         description: Regular Sunday worship service
 *         location: Main Sanctuary
 *         organizer: Pastor John
 *         churchId: 60d0fe4f5311236168a109cd
 *         createdAt: 2023-01-01T12:00:00.000Z
 *         updatedAt: 2023-01-01T12:00:00.000Z
 */

// Legacy event type options (kept for backward compatibility during migration)
export type LegacyEventType = 'service' | 'rehearsal' | 'meeting' | 'youth';

// Event status options
export type EventStatus = 'draft' | 'published' | 'completed';

export interface IEvent extends Document {
  title: string;
  date: Date;
  time: string;
  // New field for referencing EventType model
  eventTypeId: mongoose.Types.ObjectId;
  // Legacy field kept for backward compatibility
  type?: LegacyEventType;
  status: EventStatus;
  description?: string;
  location?: string;
  organizer?: string;
  attendees?: string[];
  churchId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// For API responses, we convert the MongoDB _id to id
export interface EventResponse {
  id: string;
  title: string;
  date: string; // ISO string format
  time: string;
  // Include both new and legacy fields in response
  eventTypeId: string;
  eventType?: {
    id: string;
    name: string;
    code: string;
    color: string;
    icon?: string;
  };
  // Legacy field
  type?: LegacyEventType;
  status: EventStatus;
  description?: string;
  location?: string;
  organizer?: string;
  attendees?: string[];
  churchId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Event title cannot be more than 100 characters']
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true
    },
    // New field for referencing EventType model
    eventTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventType',
      required: [true, 'Event type ID is required']
    },
    // Legacy field kept for backward compatibility
    type: {
      type: String,
      enum: {
        values: ['service', 'rehearsal', 'meeting', 'youth'],
        message: 'Event type must be service, rehearsal, meeting, or youth'
      },
      // Not required anymore as we use eventTypeId
      required: false
    },
    status: {
      type: String,
      required: [true, 'Event status is required'],
      enum: {
        values: ['draft', 'published', 'completed'],
        message: 'Event status must be draft, published, or completed'
      },
      default: 'draft'
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot be more than 100 characters']
    },
    organizer: {
      type: String,
      trim: true,
      maxlength: [100, 'Organizer name cannot be more than 100 characters']
    },
    attendees: [{
      type: String,
      trim: true
    }],
    churchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Church',
      required: [true, 'Church ID is required']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by user ID is required']
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for common queries
EventSchema.index({ churchId: 1, date: 1 });
EventSchema.index({ eventTypeId: 1 });
EventSchema.index({ type: 1 }); // Keep legacy index
EventSchema.index({ status: 1 });

// Transform document for API responses
EventSchema.methods.toJSON = function() {
  const event = this.toObject();
  const response: any = {
    id: event._id.toString(),
    title: event.title,
    date: event.date.toISOString(),
    time: event.time,
    eventTypeId: event.eventTypeId ? event.eventTypeId.toString() : undefined,
    // eventType will be populated separately
    type: event.type, // Include legacy field if available
    status: event.status,
    description: event.description,
    location: event.location,
    organizer: event.organizer,
    attendees: event.attendees,
    churchId: event.churchId.toString(),
    createdBy: event.createdBy.toString(),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString()
  };
  
  // If the eventType was populated, include it in the response
  if (event.eventTypeId && typeof event.eventTypeId !== 'string' && event.eventTypeId._id) {
    response.eventType = {
      id: event.eventTypeId._id.toString(),
      name: event.eventTypeId.name,
      code: event.eventTypeId.code,
      color: event.eventTypeId.color,
      icon: event.eventTypeId.icon
    };
  }
  
  return response;
};

export default mongoose.model<IEvent>('Event', EventSchema); 