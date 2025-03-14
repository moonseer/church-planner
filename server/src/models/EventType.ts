import mongoose, { Schema, Document } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     EventType:
 *       type: object
 *       required:
 *         - name
 *         - code
 *         - color
 *         - churchId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the event type
 *         name:
 *           type: string
 *           description: The name of the event type
 *           maxLength: 50
 *         code:
 *           type: string
 *           description: A unique code for the event type
 *           maxLength: 20
 *           pattern: ^[a-z0-9-]+$
 *         color:
 *           type: string
 *           description: The color associated with this event type (hex code)
 *           pattern: ^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
 *         icon:
 *           type: string
 *           description: An optional icon identifier for the event type
 *         churchId:
 *           type: string
 *           description: The ID of the church this event type belongs to
 *         isDefault:
 *           type: boolean
 *           description: Whether this is a default event type
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created this event type
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the event type was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the event type was last updated
 *       example:
 *         id: 60d0fe4f5311236168a109cc
 *         name: Sunday Service
 *         code: sunday-service
 *         color: #3498db
 *         icon: church
 *         churchId: 60d0fe4f5311236168a109cd
 *         isDefault: true
 *         createdAt: 2023-01-01T12:00:00.000Z
 *         updatedAt: 2023-01-01T12:00:00.000Z
 */

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