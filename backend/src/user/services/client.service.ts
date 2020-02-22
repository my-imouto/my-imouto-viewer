import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import { UserLevel } from "../user-level.enum";
import { ObjectID } from 'bson';

@Injectable()
export class ClientService {

  constructor(@InjectModel('User') private readonly User: Model<User>) {}

  async create(phone: string, name?: string) {
    const data: any = {
      phoneNumber: phone.replace(/\s+/g, ''),
      role: UserLevel.User
    };

    if (name) {
      data.name = name;
    }

    const user = new this.User(data);
    await user.save();
    return user;
  }

  async update(id: ObjectID, phone: string, name?: string) {
    const user = await this.User.findById(id).orFail();

    if (name) {
      user.name = name;
    }

    await user.save();
    return user;
  }

  index() {
    return this.User.find({role: UserLevel.User});
  }

  get(id: ObjectID) {
    return this.User.findOne({
      _id: id,
      role: UserLevel.User
    }).orFail();
  }

  getByName(name: string) {
    return this.User.findOne({
      name,
      role: UserLevel.User
    }).orFail();
  }

}
