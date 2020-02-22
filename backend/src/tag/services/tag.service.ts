import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TagModelName, Tag } from '../schema/tag.schema';
import { Model } from 'mongoose';
import { TagType } from '../tag-type.enum';

@Injectable()
export class TagService {

  constructor(@InjectModel(TagModelName) private readonly Tag: Model<Tag>) {}

  async createMany(tagNames: string[]) {
    let tags = await this.Tag.find({ name: {$in: tagNames} });
    const newTagNames = tagNames.filter(name => !tags.find(tag => tag.name == name));

    if (newTagNames.length) {
      const newDocs = [];

      for (let i = 0; i < newTagNames.length; i++) {
        newDocs.push({
          name: newTagNames[i],
          type: TagType.General
        });
      }

      await this.Tag.collection.insertMany(newDocs);

      tags = tags.concat(newDocs.map(doc => new this.Tag(doc)));
    }

    return tags;
  }

  findAll(tagNames: string[]) {
    return this.Tag.find({name: {$in: tagNames}});
  }

}
