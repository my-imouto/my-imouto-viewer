import { NestFactory } from '@nestjs/core';
import { Module, Injectable, INestApplicationContext } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DbModule } from 'src/common/db.module';
import { PostModule } from 'src/post/post.module';
import { PostProcessor } from 'src/post/services/post-processor';
import { resolve } from 'path';
import { UserModule, User } from 'src/user';
import { TagModule } from 'src/tag/tag.module';
import { readdirSync } from 'fs';

const importFolder = resolve(__dirname + '/../../../import');

@Injectable()
class PostCreateService {

  constructor(@InjectModel('User') private readonly User: Model<User>,
    private readonly PostProcessor: PostProcessor) {}

  async process() {
    const user = await this.User.findOne();

    const fileNames = readdirSync(importFolder);

    for (let i = 0; i < fileNames.length; i++) {
      await this.PostProcessor.processFile(user, importFolder + '/' + fileNames[i]);
      console.log('Processed file ' + fileNames[i]);
    }
  }

}

@Module({
  imports: [
    DbModule,
    PostModule,
    TagModule,
    UserModule
  ],
  providers: [
    PostCreateService,
    PostProcessor
  ]
})
class CheckoutsModule { }

export default async function () {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(CheckoutsModule);
  await app.get(PostCreateService).process();
}
