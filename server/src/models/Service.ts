import mongoose, { Schema, Document } from 'mongoose';

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