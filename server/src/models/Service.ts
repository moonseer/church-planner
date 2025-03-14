import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceItem:
 *       type: object
 *       required:
 *         - id
 *         - type
 *         - title
 *         - duration
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the service item
 *         type:
 *           type: string
 *           enum: [song, scripture, prayer, sermon, announcement, offering, custom]
 *           description: The type of service item
 *         title:
 *           type: string
 *           description: The title of the service item
 *         details:
 *           type: string
 *           description: Additional details about the service item
 *         duration:
 *           type: number
 *           description: The duration of the service item in minutes
 *         assignedTo:
 *           type: string
 *           description: The person assigned to this service item
 *         notes:
 *           type: string
 *           description: Additional notes for this service item
 *       example:
 *         id: item-1
 *         type: song
 *         title: Amazing Grace
 *         details: Key of G, 3 verses
 *         duration: 5
 *         assignedTo: Worship Leader
 *         notes: Start with piano only
 *
 *     Service:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - time
 *         - items
 *         - churchId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the service
 *         title:
 *           type: string
 *           description: The title of the service
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the service
 *         time:
 *           type: string
 *           description: The time of the service
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ServiceItem'
 *           description: The items included in the service
 *         churchId:
 *           type: string
 *           description: The ID of the church this service belongs to
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created this service
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the service was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the service was last updated
 *       example:
 *         id: 60d0fe4f5311236168a109ce
 *         title: Sunday Morning Worship
 *         date: 2023-01-15
 *         time: 10:00 AM
 *         items:
 *           - id: item-1
 *             type: song
 *             title: Amazing Grace
 *             duration: 5
 *             assignedTo: Worship Leader
 *           - id: item-2
 *             type: prayer
 *             title: Opening Prayer
 *             duration: 3
 *             assignedTo: Pastor John
 *         churchId: 60d0fe4f5311236168a109cd
 *         createdAt: 2023-01-01T12:00:00.000Z
 *         updatedAt: 2023-01-01T12:00:00.000Z
 */

// Service item type options
export type ServiceItemType = 'song' | 'scripture' | 'prayer' | 'sermon' | 'announcement' | 'offering' | 'custom';

// Service item interface
export interface IServiceItem {
  id: string;
  type: ServiceItemType;
  title: string;
  details?: string;
  duration: number; // in minutes
  assignedTo?: string;
  notes?: string;
}

// Service interface
export interface IService extends Document {
  title: string;
  date: Date;
  time: string;
  items: IServiceItem[];
  churchId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// For API responses, we convert the MongoDB _id to id
export interface ServiceResponse {
  id: string;
  title: string;
  date: string; // ISO string format
  time: string;
  items: IServiceItem[];
  churchId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Service item schema
const ServiceItemSchema: Schema = new Schema({
  id: {
    type: String,
    required: [true, 'Service item ID is required']
  },
  type: {
    type: String,
    required: [true, 'Service item type is required'],
    enum: {
      values: ['song', 'scripture', 'prayer', 'sermon', 'announcement', 'offering', 'custom'],
      message: 'Service item type must be song, scripture, prayer, sermon, announcement, offering, or custom'
    }
  },
  title: {
    type: String,
    required: [true, 'Service item title is required'],
    trim: true,
    maxlength: [100, 'Service item title cannot be more than 100 characters']
  },
  details: {
    type: String,
    trim: true,
    maxlength: [200, 'Service item details cannot be more than 200 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Service item duration is required'],
    min: [1, 'Service item duration must be at least 1 minute'],
    max: [120, 'Service item duration cannot be more than 120 minutes']
  },
  assignedTo: {
    type: String,
    trim: true,
    maxlength: [100, 'Assigned to cannot be more than 100 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  }
});

// Service schema
const ServiceSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [100, 'Service title cannot be more than 100 characters']
    },
    date: {
      type: Date,
      required: [true, 'Service date is required']
    },
    time: {
      type: String,
      required: [true, 'Service time is required'],
      trim: true
    },
    items: [ServiceItemSchema],
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
ServiceSchema.index({ churchId: 1, date: 1 });

// Transform document for API responses
ServiceSchema.methods.toJSON = function() {
  const service = this.toObject();
  return {
    id: service._id.toString(),
    title: service.title,
    date: service.date.toISOString(),
    time: service.time,
    items: service.items,
    churchId: service.churchId.toString(),
    createdBy: service.createdBy.toString(),
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString()
  };
};

export default mongoose.model<IService>('Service', ServiceSchema); 