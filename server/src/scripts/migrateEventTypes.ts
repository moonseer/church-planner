/**
 * Migration script to create default event types and update existing events
 * 
 * This script:
 * 1. Creates default event types for each church
 * 2. Updates existing events to reference the new event type records
 * 
 * Run with: npx ts-node src/scripts/migrateEventTypes.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database';
import Event from '../models/Event';
import EventType from '../models/EventType';
import User from '../models/User';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Default event types with colors
const DEFAULT_EVENT_TYPES = [
  {
    name: 'Service',
    code: 'service',
    color: '#4F46E5', // Indigo
    isDefault: true
  },
  {
    name: 'Rehearsal',
    code: 'rehearsal',
    color: '#0EA5E9', // Sky
    isDefault: true
  },
  {
    name: 'Meeting',
    code: 'meeting',
    color: '#10B981', // Emerald
    isDefault: true
  },
  {
    name: 'Youth',
    code: 'youth',
    color: '#8B5CF6', // Violet
    isDefault: true
  }
];

/**
 * Main migration function
 */
const migrateEventTypes = async () => {
  try {
    console.log('Starting event types migration...');
    
    // Get all churches (unique churchIds from events)
    const churches = await Event.distinct('churchId');
    console.log(`Found ${churches.length} churches with events`);
    
    // For each church, create default event types
    for (const churchId of churches) {
      console.log(`Processing church: ${churchId}`);
      
      // Find an admin user for this church to set as creator
      const adminUser = await User.findOne({ churchId });
      
      if (!adminUser) {
        console.warn(`No admin user found for church ${churchId}, skipping`);
        continue;
      }
      
      // Create default event types for this church
      const eventTypeMap = new Map();
      
      for (const typeData of DEFAULT_EVENT_TYPES) {
        // Check if this event type already exists
        let eventType = await EventType.findOne({
          churchId,
          code: typeData.code
        });
        
        // If not, create it
        if (!eventType) {
          console.log(`Creating ${typeData.name} event type for church ${churchId}`);
          eventType = await EventType.create({
            ...typeData,
            churchId,
            createdBy: adminUser._id
          });
        }
        
        // Store the mapping from legacy type to new event type ID
        eventTypeMap.set(typeData.code, eventType._id);
      }
      
      // Update all events for this church
      const events = await Event.find({ churchId });
      console.log(`Updating ${events.length} events for church ${churchId}`);
      
      for (const event of events) {
        const legacyType = event.type;
        const eventTypeId = eventTypeMap.get(legacyType);
        
        if (!eventTypeId) {
          console.warn(`No event type mapping found for legacy type ${legacyType}, skipping event ${event._id}`);
          continue;
        }
        
        // Update the event with the new event type ID
        await Event.updateOne(
          { _id: event._id },
          { $set: { eventTypeId } }
        );
      }
      
      console.log(`Completed updates for church ${churchId}`);
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
migrateEventTypes(); 