import mongoose from 'mongoose';
import { User } from '@/app/types/models';
import bcrypt from 'bcryptjs';

interface UserDocument extends mongoose.Document, Omit<User, '_id'> {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['admin', 'manager', 'helper'],
    default: 'helper'
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(this: UserDocument, next: mongoose.CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<UserDocument>('User', userSchema); 