import { sha256 } from 'sha.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { User } from './schema/user.schema';
import { UserLevel } from "./user-level.enum";

@Injectable()
export class UserService {

  constructor(@InjectModel('User') private readonly User: Model<User>) { }

  async create(email: string, name: string, password: string) {
    if (await this.User.count({email})) {
      throw new Error('Email is registered');
    }

    const hash = this.hashPassword(password);

    const user = new this.User();
    user.name = name;
    user.email = email;
    user.password = hash;

    return user.save();
  }

  hashPassword(password: string) {
    return new sha256().update(password).digest('hex');
  }

  async findOrCreateClient(phoneNumber: string, name?: string) {
    phoneNumber = phoneNumber.replace(/\s+/g, '');

    let client = await this.User.findOne({
      phoneNumber,
      role: UserLevel.User
    });

    if (!client) {
      client = new this.User();
      client.role = UserLevel.User;

      if (name) {
        client.name = name;
      }

      await client.save();
    }

    return client;
  }

}
