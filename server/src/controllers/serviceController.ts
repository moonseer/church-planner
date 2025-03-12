import { Request, Response } from 'express';
import Service, { IService, IServiceItem } from '../models/Service';
import mongoose from 'mongoose';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '../types/apiResponse';

// Extend the Express Request type to include user property
interface AuthRequest extends Request {
  user?: any; // Using any type to match how it's attached in the auth middleware
}

// Get all services for a church
export const getServices = async (req: Request, res: Response) => {
  try {
    const { churchId } = req.params;
    const { month, year } = req.query;
    
    console.log('getServices called with params:', { churchId, month, year });
    
    // Convert churchId string to ObjectId
    const churchObjectId = new mongoose.Types.ObjectId(churchId);
    
    // Build query
    const query: any = { churchId: churchObjectId };
    
    // Filter by month and year if provided
    if (month && year) {
      const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
      const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
      query.date = { $gte: startDate, $lte: endDate };
      console.log('Date range filter:', { startDate, endDate });
    }
    
    console.log('MongoDB query:', JSON.stringify(query));
    
    const services = await Service.find(query).sort({ date: 1 });
    
    console.log('Services found:', services.length);
    
    res.status(200).json(createSuccessResponse(services, undefined, services.length));
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json(createErrorResponse('Server Error', []));
  }
};

// Get a single service
export const getService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(createErrorResponse('Invalid service ID', null));
    }
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json(createErrorResponse('Service not found', null));
    }
    
    res.status(200).json(createSuccessResponse(service));
  } catch (error) {
    console.error('Error getting service:', error);
    res.status(500).json(createErrorResponse('Server Error', null));
  }
};

// Create a new service
export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const { churchId } = req.params;
    const userId = req.user?._id;
    
    console.log('createService called with params:', { churchId, userId });
    console.log('Request body:', req.body);
    
    if (!userId) {
      return res.status(401).json(createErrorResponse('User not authenticated', null));
    }
    
    // Convert churchId string to ObjectId
    const churchObjectId = new mongoose.Types.ObjectId(churchId);
    
    // Create service with church and user IDs
    const serviceData = {
      ...req.body,
      churchId: churchObjectId,
      createdBy: userId
    };
    
    console.log('Creating service with data:', serviceData);
    
    const service = await Service.create(serviceData);
    
    console.log('Service created successfully:', service);
    
    res.status(201).json(createSuccessResponse(service));
  } catch (error) {
    console.error('Error creating service:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map((val: any) => val.message);
      
      return res.status(400).json(createErrorResponse(messages.join(', '), null));
    }
    
    res.status(500).json(createErrorResponse('Server Error', null));
  }
};

// Update a service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(createErrorResponse('Invalid service ID', null));
    }
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json(createErrorResponse('Service not found', null));
    }
    
    // Update the service
    const updatedService = await Service.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(createSuccessResponse(updatedService!));
  } catch (error) {
    console.error('Error updating service:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map((val: any) => val.message);
      
      return res.status(400).json(createErrorResponse(messages.join(', '), null));
    }
    
    res.status(500).json(createErrorResponse('Server Error', null));
  }
};

// Delete a service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(createErrorResponse('Invalid service ID', null));
    }
    
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json(createErrorResponse('Service not found', null));
    }
    
    await Service.findByIdAndDelete(id);
    
    res.status(200).json(createSuccessResponse(null, 'Service deleted successfully'));
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json(createErrorResponse('Server Error', null));
  }
};

// Seed services (for development/testing)
export const seedServices = async (req: AuthRequest, res: Response) => {
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
    
    // Sample services for March 2025 (matching the calendar events)
    const march2025Services = [
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 2, 9, 0), // March 2, 2025
        time: '9:00 AM - 11:00 AM',
        items: [
          {
            id: `item-${Date.now()}-1`,
            type: 'song',
            title: 'Amazing Grace',
            details: 'Key: G, Worship Leader: Sarah',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-2`,
            type: 'prayer',
            title: 'Opening Prayer',
            details: '',
            duration: 3,
            assignedTo: 'Pastor John',
            notes: ''
          },
          {
            id: `item-${Date.now()}-3`,
            type: 'custom',
            title: 'Weekly Announcements',
            details: 'Upcoming events and ministry updates',
            duration: 5,
            assignedTo: 'Ministry Coordinator',
            notes: 'Remember to mention the youth retreat next weekend'
          },
          {
            id: `item-${Date.now()}-4`,
            type: 'song',
            title: 'How Great Is Our God',
            details: 'Key: C, Worship Leader: Sarah',
            duration: 4,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-5`,
            type: 'scripture',
            title: 'Scripture Reading',
            details: 'Romans 8:28-39',
            duration: 3,
            assignedTo: 'Elder Mike',
            notes: ''
          },
          {
            id: `item-${Date.now()}-6`,
            type: 'sermon',
            title: 'Finding Peace in Troubled Times',
            details: 'Part 2 of the "Peace" series',
            duration: 30,
            assignedTo: 'Pastor John',
            notes: 'Main points: 1) God\'s presence brings peace, 2) Peace through prayer, 3) Sharing peace with others'
          },
          {
            id: `item-${Date.now()}-7`,
            type: 'song',
            title: 'It Is Well',
            details: 'Key: D, Worship Leader: Sarah',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-8`,
            type: 'offering',
            title: 'Tithes and Offerings',
            details: '',
            duration: 5,
            assignedTo: 'Deacon Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-9`,
            type: 'prayer',
            title: 'Closing Prayer',
            details: '',
            duration: 2,
            assignedTo: 'Pastor John',
            notes: ''
          }
        ],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 9, 9, 0), // March 9, 2025
        time: '9:00 AM - 11:00 AM',
        items: [
          {
            id: `item-${Date.now()}-10`,
            type: 'song',
            title: 'Great Is Thy Faithfulness',
            details: 'Key: D, Worship Leader: Mark',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-11`,
            type: 'prayer',
            title: 'Opening Prayer',
            details: '',
            duration: 3,
            assignedTo: 'Elder David',
            notes: ''
          },
          {
            id: `item-${Date.now()}-12`,
            type: 'custom',
            title: 'Weekly Announcements',
            details: 'Upcoming events and ministry updates',
            duration: 5,
            assignedTo: 'Ministry Coordinator',
            notes: ''
          },
          {
            id: `item-${Date.now()}-13`,
            type: 'song',
            title: 'In Christ Alone',
            details: 'Key: G, Worship Leader: Mark',
            duration: 4,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-14`,
            type: 'scripture',
            title: 'Scripture Reading',
            details: 'Philippians 4:4-9',
            duration: 3,
            assignedTo: 'Elder Rachel',
            notes: ''
          },
          {
            id: `item-${Date.now()}-15`,
            type: 'sermon',
            title: 'The Peace That Surpasses Understanding',
            details: 'Part 3 of the "Peace" series',
            duration: 30,
            assignedTo: 'Pastor John',
            notes: ''
          },
          {
            id: `item-${Date.now()}-16`,
            type: 'song',
            title: 'Peace Like a River',
            details: 'Key: C, Worship Leader: Mark',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-17`,
            type: 'offering',
            title: 'Tithes and Offerings',
            details: '',
            duration: 5,
            assignedTo: 'Deacon Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-18`,
            type: 'prayer',
            title: 'Closing Prayer',
            details: '',
            duration: 2,
            assignedTo: 'Pastor John',
            notes: ''
          }
        ],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 16, 9, 0), // March 16, 2025
        time: '9:00 AM - 11:00 AM',
        items: [
          {
            id: `item-${Date.now()}-19`,
            type: 'song',
            title: '10,000 Reasons',
            details: 'Key: G, Worship Leader: Sarah',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-20`,
            type: 'prayer',
            title: 'Opening Prayer',
            details: '',
            duration: 3,
            assignedTo: 'Pastor John',
            notes: ''
          },
          {
            id: `item-${Date.now()}-21`,
            type: 'custom',
            title: 'Weekly Announcements',
            details: 'Upcoming events and ministry updates',
            duration: 5,
            assignedTo: 'Ministry Coordinator',
            notes: ''
          },
          {
            id: `item-${Date.now()}-22`,
            type: 'song',
            title: 'Cornerstone',
            details: 'Key: B, Worship Leader: Sarah',
            duration: 4,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-23`,
            type: 'scripture',
            title: 'Scripture Reading',
            details: 'Matthew 5:1-12',
            duration: 3,
            assignedTo: 'Elder Mike',
            notes: ''
          },
          {
            id: `item-${Date.now()}-24`,
            type: 'sermon',
            title: 'Blessed Are the Peacemakers',
            details: 'Part 4 of the "Peace" series',
            duration: 30,
            assignedTo: 'Pastor John',
            notes: ''
          },
          {
            id: `item-${Date.now()}-25`,
            type: 'song',
            title: 'Blessed Assurance',
            details: 'Key: D, Worship Leader: Sarah',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-26`,
            type: 'offering',
            title: 'Tithes and Offerings',
            details: '',
            duration: 5,
            assignedTo: 'Deacon Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-27`,
            type: 'prayer',
            title: 'Closing Prayer',
            details: '',
            duration: 2,
            assignedTo: 'Pastor John',
            notes: ''
          }
        ],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 23, 9, 0), // March 23, 2025
        time: '9:00 AM - 11:00 AM',
        items: [
          {
            id: `item-${Date.now()}-28`,
            type: 'song',
            title: 'How Great Thou Art',
            details: 'Key: E, Worship Leader: Mark',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-29`,
            type: 'prayer',
            title: 'Opening Prayer',
            details: '',
            duration: 3,
            assignedTo: 'Elder David',
            notes: ''
          },
          {
            id: `item-${Date.now()}-30`,
            type: 'custom',
            title: 'Weekly Announcements',
            details: 'Upcoming events and ministry updates',
            duration: 5,
            assignedTo: 'Ministry Coordinator',
            notes: ''
          },
          {
            id: `item-${Date.now()}-31`,
            type: 'song',
            title: 'Mighty to Save',
            details: 'Key: A, Worship Leader: Mark',
            duration: 4,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-32`,
            type: 'scripture',
            title: 'Scripture Reading',
            details: 'John 14:25-31',
            duration: 3,
            assignedTo: 'Elder Rachel',
            notes: ''
          },
          {
            id: `item-${Date.now()}-33`,
            type: 'sermon',
            title: 'Peace I Leave With You',
            details: 'Part 5 of the "Peace" series',
            duration: 30,
            assignedTo: 'Pastor John',
            notes: ''
          },
          {
            id: `item-${Date.now()}-34`,
            type: 'song',
            title: 'The Blessing',
            details: 'Key: C, Worship Leader: Mark',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-35`,
            type: 'offering',
            title: 'Tithes and Offerings',
            details: '',
            duration: 5,
            assignedTo: 'Deacon Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-36`,
            type: 'prayer',
            title: 'Closing Prayer',
            details: '',
            duration: 2,
            assignedTo: 'Pastor John',
            notes: ''
          }
        ],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Morning Service',
        date: new Date(2025, 2, 30, 9, 0), // March 30, 2025
        time: '9:00 AM - 11:00 AM',
        items: [
          {
            id: `item-${Date.now()}-37`,
            type: 'song',
            title: 'This Is Amazing Grace',
            details: 'Key: G, Worship Leader: Sarah',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-38`,
            type: 'prayer',
            title: 'Opening Prayer',
            details: '',
            duration: 3,
            assignedTo: 'Pastor John',
            notes: ''
          },
          {
            id: `item-${Date.now()}-39`,
            type: 'custom',
            title: 'Weekly Announcements',
            details: 'Upcoming events and ministry updates',
            duration: 5,
            assignedTo: 'Ministry Coordinator',
            notes: ''
          },
          {
            id: `item-${Date.now()}-40`,
            type: 'song',
            title: 'Good Good Father',
            details: 'Key: C, Worship Leader: Sarah',
            duration: 4,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-41`,
            type: 'scripture',
            title: 'Scripture Reading',
            details: 'Isaiah 26:1-4',
            duration: 3,
            assignedTo: 'Elder Mike',
            notes: ''
          },
          {
            id: `item-${Date.now()}-42`,
            type: 'sermon',
            title: 'Perfect Peace',
            details: 'Final part of the "Peace" series',
            duration: 30,
            assignedTo: 'Pastor John',
            notes: ''
          },
          {
            id: `item-${Date.now()}-43`,
            type: 'song',
            title: 'What a Beautiful Name',
            details: 'Key: D, Worship Leader: Sarah',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-44`,
            type: 'offering',
            title: 'Tithes and Offerings',
            details: '',
            duration: 5,
            assignedTo: 'Deacon Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-45`,
            type: 'prayer',
            title: 'Closing Prayer',
            details: '',
            duration: 2,
            assignedTo: 'Pastor John',
            notes: ''
          }
        ],
        churchId: churchObjectId,
        createdBy: userId
      }
    ];
    
    // Sample services for current month
    const currentMonthServices = [
      {
        title: 'Sunday Morning Service',
        date: new Date(currentYear, currentMonth, 1, 9, 0), // First Sunday of current month
        time: '9:00 AM - 11:00 AM',
        items: [
          {
            id: `item-${Date.now()}-46`,
            type: 'song',
            title: 'Amazing Grace',
            details: 'Key: G, Worship Leader: Sarah',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-47`,
            type: 'prayer',
            title: 'Opening Prayer',
            details: '',
            duration: 3,
            assignedTo: 'Pastor John',
            notes: ''
          },
          {
            id: `item-${Date.now()}-48`,
            type: 'custom',
            title: 'Weekly Announcements',
            details: 'Upcoming events and ministry updates',
            duration: 5,
            assignedTo: 'Ministry Coordinator',
            notes: ''
          },
          {
            id: `item-${Date.now()}-49`,
            type: 'song',
            title: 'How Great Is Our God',
            details: 'Key: C, Worship Leader: Sarah',
            duration: 4,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-50`,
            type: 'scripture',
            title: 'Scripture Reading',
            details: 'Romans 8:28-39',
            duration: 3,
            assignedTo: 'Elder Mike',
            notes: ''
          },
          {
            id: `item-${Date.now()}-51`,
            type: 'sermon',
            title: 'Finding Peace in Troubled Times',
            details: 'Part 1 of the "Peace" series',
            duration: 30,
            assignedTo: 'Pastor John',
            notes: ''
          },
          {
            id: `item-${Date.now()}-52`,
            type: 'song',
            title: 'It Is Well',
            details: 'Key: D, Worship Leader: Sarah',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-53`,
            type: 'offering',
            title: 'Tithes and Offerings',
            details: '',
            duration: 5,
            assignedTo: 'Deacon Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-54`,
            type: 'prayer',
            title: 'Closing Prayer',
            details: '',
            duration: 2,
            assignedTo: 'Pastor John',
            notes: ''
          }
        ],
        churchId: churchObjectId,
        createdBy: userId
      },
      {
        title: 'Sunday Evening Service',
        date: new Date(currentYear, currentMonth, 1, 18, 0), // First Sunday evening of current month
        time: '6:00 PM - 7:30 PM',
        items: [
          {
            id: `item-${Date.now()}-55`,
            type: 'song',
            title: 'Build My Life',
            details: 'Key: D, Worship Leader: Mark',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-56`,
            type: 'prayer',
            title: 'Opening Prayer',
            details: '',
            duration: 3,
            assignedTo: 'Elder David',
            notes: ''
          },
          {
            id: `item-${Date.now()}-57`,
            type: 'song',
            title: 'Reckless Love',
            details: 'Key: C, Worship Leader: Mark',
            duration: 4,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-58`,
            type: 'scripture',
            title: 'Scripture Reading',
            details: 'Psalm 23',
            duration: 3,
            assignedTo: 'Elder Rachel',
            notes: ''
          },
          {
            id: `item-${Date.now()}-59`,
            type: 'sermon',
            title: 'The Good Shepherd',
            details: '',
            duration: 25,
            assignedTo: 'Pastor John',
            notes: ''
          },
          {
            id: `item-${Date.now()}-60`,
            type: 'song',
            title: 'The Goodness of God',
            details: 'Key: B, Worship Leader: Mark',
            duration: 5,
            assignedTo: 'Worship Team',
            notes: ''
          },
          {
            id: `item-${Date.now()}-61`,
            type: 'prayer',
            title: 'Closing Prayer',
            details: '',
            duration: 2,
            assignedTo: 'Pastor John',
            notes: ''
          }
        ],
        churchId: churchObjectId,
        createdBy: userId
      }
    ];
    
    // Combine all services
    const allServices = [...march2025Services, ...currentMonthServices];
    
    // Delete existing services for this church
    await Service.deleteMany({
      churchId: churchObjectId
    });
    
    // Create new services
    const services = await Service.create(allServices);
    
    // Convert to response format
    const responseData = services.map(service => service.toJSON());
    
    res.status(201).json(createSuccessResponse(
      responseData, 
      'Sample services created successfully', 
      services.length
    ));
  } catch (error) {
    console.error('Error seeding services:', error);
    res.status(500).json(createErrorResponse('Server Error', []));
  }
}; 