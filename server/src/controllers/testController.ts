import { Request, Response } from 'express';

// Simple test function
export const testFunction = (req: Request, res: Response): void => {
  res.status(200).json({ success: true, message: 'Test controller is working' });
}; 