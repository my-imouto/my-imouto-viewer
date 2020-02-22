import 'mongoose';
import { Schema, Document } from './../../common/database/schema';
import { TagType } from '../tag-type.enum';

export const TagModelName = 'Tag';

export interface Tag extends Document {
  name: string,
  type: TagType
}

export const TagSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: Object.keys(TagType).map(k => TagType[k])
  },
});
