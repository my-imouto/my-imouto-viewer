import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { ClientService } from './services/client.service';
import { ClientResolver } from './resolvers/client.resolver';

const Models = MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]);

@Module({
  imports: [
    Models
  ],
  providers: [
    UserService,
    // ClientService,
    // ClientResolver
  ],
  exports: [ UserService, Models ]
})
export class UserModule { }
