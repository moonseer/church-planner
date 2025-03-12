import mongoose, { Schema, Document } from 'mongoose';

// Event type options
export type EventType = 'service' | 'rehearsal' | 'meeting' | 'youth';

// Event status options
export type EventStatus = 'draft' | 'published' | 'completed';

export interface IEvent extends Document {
  title: string;
  date: Date;
  time: string;
  type: EventType;
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
  type: EventType;
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
    type: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: ['service', 'rehearsal', 'meeting', 'youth'],
        message: 'Event type must be service, rehearsal, meeting, or youth'
      }
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
EventSchema.index({ type: 1 });
EventSchema.index({ status: 1 });

// Transform document for API responses
EventSchema.methods.toJSON = function() {
  const event = this.toObject();
  return {
    id: event._id.toString(),
    title: event.title,
    date: event.date.toISOString(),
    time: event.time,
    type: event.type,
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
};

export default mongoose.model<IEvent>('Event', EventSchema); 