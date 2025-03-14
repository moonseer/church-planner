import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - churchName
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The full name of the user
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password (hashed)
 *         churchName:
 *           type: string
 *           description: The name of the user's church
 *         role:
 *           type: string
 *           enum: [admin, user, volunteer]
 *           default: user
 *           description: The role of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         name: John Doe
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@example.com
 *         churchName: First Baptist Church
 *         role: user
 *         createdAt: 2021-06-21T12:00:00.000Z
 *         updatedAt: 2021-06-21T12:00:00.000Z
 */

export interface IUser extends Document {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  churchName: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// Ensure JWT_SECRET is set
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('JWT_SECRET environment variable is not set!');
    throw new Error('JWT_SECRET environment variable is not set. This is a critical security issue.');
  }
  return secret;
};

// Define User Schema
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  churchName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'volunteer'], default: 'user' }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function(): string {
  const jwtSecret = getJwtSecret();
  const jwtExpire = process.env.JWT_EXPIRE || '2h';
  
  return jwt.sign(
    { id: this._id, name: this.name, email: this.email, role: this.role },
    jwtSecret,
    { expiresIn: jwtExpire } as jwt.SignOptions
  );
};

// Create User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User; 