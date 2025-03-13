import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface for EventType document
 */
export interface IEventType extends Document {
  name: string;
  code: string;
  color: string;
  icon?: string;
  churchId: mongoose.Types.ObjectId;
  isDefault: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema for EventType model
 */
const EventTypeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Event type name is required'],
      trim: true,
      maxlength: [50, 'Event type name cannot be more than 50 characters']
    },
    code: {
      type: String,
      required: [true, 'Event type code is required'],
      trim: true,
      lowercase: true,
      maxlength: [20, 'Event type code cannot be more than 20 characters'],
      match: [/^[a-z0-9-]+$/, 'Event type code can only contain lowercase letters, numbers, and hyphens']
    },
    color: {
      type: String,
      required: [true, 'Event type color is required'],
      trim: true,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex color code']
    },
    icon: {
      type: String,
      trim: true
    },
    churchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Church',
      required: [true, 'Church ID is required']
    },
    isDefault: {
      type: Boolean,
      default: false
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

// Add compound index for churchId and code to ensure uniqueness within a church
EventTypeSchema.index({ churchId: 1, code: 1 }, { unique: true });

// Add index for common queries
EventTypeSchema.index({ churchId: 1 });

/**
 * EventType model
 */
const EventType = mongoose.model<IEventType>('EventType', EventTypeSchema);

export default EventType; 