import 'mongoose';
import { Schema, Document } from './../../common/database/schema';
import { UserLevel } from '../user-level.enum';

export const UserModelName = 'User';

export interface User extends Document {
  email?: string,
  name?: string,
  password?: string,
  role: UserLevel
}

export const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: Object.keys(UserLevel).map(k => UserLevel[k])
  }
});

// UserSchema.index({ email: 1}, { unique: true });
// UserSchema.index({ phoneNumber: 1}, { unique: true });
