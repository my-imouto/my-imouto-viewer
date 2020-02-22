import { Injectable } from '@nestjs/common';
import { PostModelName, Post } from '../schema/post.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectID } from 'bson';

@Injectable()
export class PostSearcher {

  readonly DefaultLimit = 25;

  constructor(@InjectModel(PostModelName) private readonly Post: Model<Post>) {}

  search(limit: number, query: string, page: number) {
    limit = limit || this.DefaultLimit;
    page = page >= 0 ? page : 0;

    const include = [];
    const exclude = [];
    const tagsNameMatch: any = {};

    this.processTagsQuery(query)
      .forEach(tag => {
        if (/^\-/.test(tag)) {
          exclude.push(tag.substr(1));
        } else {
          include.push(tag);
        }
      });

    if (include.length) {
      tagsNameMatch.$all = include;
    }
    if (exclude.length) {
      tagsNameMatch.$nin = exclude;
    }

    const steps: any[] = [
      {$sort: { _id: -1 }}
    ];

    if (include.length || exclude.length) {
      steps.push({$match: {tags: tagsNameMatch}});
    }

    steps.push({$skip: page * limit});
    steps.push({$limit: limit});

    return this.Post.aggregate(steps);
  }

  findById(id: ObjectID) {
    return this.Post.findById(id).orFail();
  }

  private processTagsQuery(tags: string|string[]) {
    if (!Array.isArray(tags)) {
      tags = tags.split(/\s+/);
    }

    return tags
      .map(t => t.replace('$', '\$'))
      .filter(t => !!t)
      .filter((t, i, a) => a.indexOf(t) === i);
  }

}
