import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagModelName, TagSchema } from './schema/tag.schema';
import { TagService } from './services/tag.service';

const Models = MongooseModule.forFeature([
  { name: TagModelName, schema: TagSchema }
])

@Module({
  imports: [
    Models
  ],
  providers: [
    TagService
  ],
  exports: [
    Models,
    TagService
  ]
})
export class TagModule {}
