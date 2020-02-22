import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './../user/schema/user.schema';
import { Session } from './schema/session.schema';
import { UserService } from './../user';
import { sha256 } from 'sha.js';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService,
    @InjectModel('User') private readonly User: Model<User>,
    @InjectModel('Session') private readonly Session: Model<Session>) { }

  findByCredentials(email: string, password: string) {
    return this.User.findOne({
      email,
      password: this.userService.hashPassword(password)
    });
  }

  createSession(user: User) {
    const now = Date.now();

    const session = new this.Session();
    session.user = user._id;
    session.token = (new sha256() as any).update(user.name + user.email + now).digest('hex');
    session.expiresAt = new Date(now + (60 * 60 * 24 * 365 * 1000));

    return session.save();
  }

  async findUserByToken(token: string) {
    const session = await this.Session.findOne({token}).populate('user');

    if (session) {
      if (session.expiresAt.getTime() > Date.now()) {
        return {user: session.user, session};
      } else {
        await session.remove();
      }
    }
  }

}
