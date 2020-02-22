import * as mongoose from 'mongoose';
import { Schema, Document } from './../../common/database/schema';
import { ObjectID } from 'bson';
import { User } from './../../user';

export interface Session extends Document {
  user: ObjectID | User,
  expiresAt: Date,
  token: string
}

export const SessionSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: Date,
  token: String
});

SessionSchema.index({ user: 1 });
SessionSchema.index({ token: 1 }, { unique: true });
