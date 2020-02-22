import { Module } from '@nestjs/common';
import { UserModule } from './../user/user.module';
import { HttpStrategy } from './http.strategy';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './schema/session.schema';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';

const Models = MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]);

@Module({
  controllers: [
    // AuthController
  ],
  imports: [
    Models,
    PassportModule.register({ defaultStrategy: 'bearer', property: 'auth' }),
    UserModule
  ],
  exports: [ Models, AuthService ],
  providers: [
    AuthService,
    // HttpStrategy,
  ]
})
export class AuthModule {}
