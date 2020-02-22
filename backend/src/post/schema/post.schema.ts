import 'mongoose';
import { Schema, Document } from './../../common/database/schema';
import { User } from 'src/user';
import { ObjectID } from 'bson';
import { UserModelName } from 'src/user';
import { Types } from 'mongoose';

export const PostModelName = 'Post';

export interface Post extends Document {
  md5: string,
  user: User | ObjectID,
  width: number,
  height: number,
  previewWidth: number,
  previewHeight: number,
  sampleWidth?: number,
  sampleHeight?: number,
  tags: string[]
}

export const PostSchema = new Schema({
  md5: { type: String, required: true },
  user: { type: Types.ObjectId, ref: UserModelName, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  previewWidth: { type: Number, required: true },
  previewHeight: { type: Number, required: true },
  sampleWidth: Number,
  sampleHeight: Number,
  tags: { type: [String], required: true }
});
