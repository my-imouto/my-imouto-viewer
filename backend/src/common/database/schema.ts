import { Schema as MongooseSchema, Document as MongooseDocument } from 'mongoose';
import { ObjectID } from 'bson';

/**
 * Add these values which are common part of a Mongoose document
 */
export interface Document extends MongooseDocument {
  id: string;
  _id: ObjectID;
  createdAt: Date;
  updatedAt: Date;

  toApi(): any;
}

export class Schema extends MongooseSchema {

  constructor(definition, options: any = {}) {
    if (options.timestamps == undefined) {
      options.timestamps = true;
    }

    super(definition, options);

    this.method('toApi', function() {
      const api = this.toJSON();
      api.id = api._id;
      delete api._id;
      delete api.__v;
      return api;
    });
  }

}
