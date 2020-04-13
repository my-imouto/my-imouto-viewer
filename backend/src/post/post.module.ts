import { Module } from '@nestjs/common';
import { PostProcessor } from './services/post-processor';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModelName, PostSchema } from './schema/post.schema';
import { TagModule } from 'src/tag/tag.module';
import { PostResolver } from './resolvers/post.resolver';
import { PostSearcher } from './services/post-searcher';
import { AppConfigModule } from 'src/common/app-config/app-config.module';
import { ImagickModule } from 'src/imagick/imagick.module';

const Models = MongooseModule.forFeature([
  { name: PostModelName, schema: PostSchema }
])

@Module({
  imports: [
    Models,
    AppConfigModule,
    TagModule,
    ImagickModule
  ],
  providers: [
    PostProcessor,
    PostResolver,
    PostSearcher
  ],
  exports: [
    Models
  ]
})
export class PostModule {}
