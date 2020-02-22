import { NestFactory } from '@nestjs/core';
import { AppModule } from './../app.module';
import * as  prompt from 'prompt';
import { INestApplication } from '@nestjs/common';
import { UserService } from '../user/user.service';

const schema = {
  properties: {
    email: {
      description: 'Email',
      format: 'email',
      message: 'Must be a valid email address',
      required: true
    },
    name: {
      description: 'Name',
      pattern: /^[a-zA-Z]+$/,
      message: 'Name must be only letters',
      required: true
    },
    password: {
      description: 'Password',
      hidden: true,
      required: true
    },
    passwordConfirmation: {
      description: 'Confirm password',
      hidden: true,
      required: true
    }
  }
};

export default function () {
  let app: INestApplication;

  return NestFactory
    .create(AppModule)
    .then((_app) => {
      app = _app;

      return new Promise((resolve, reject) => {
        prompt.start();

        prompt.get(schema, (err, result) => {
          if (err) {
            reject(err);
          } else if (result.password !== result.passwordConfirmation) {
            reject('Passwords do not match');
          } else {
            resolve(result);
          }
        })
      });
    })
    .then((result: any) => {
      return app.get(UserService).create(result.email,
        result.name,
        result.password);
    })
    .then(() => {
      console.log('User created');
    });
}
