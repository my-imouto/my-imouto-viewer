import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './common/db.module';

import { gqlModuleConfig } from './gql-module.config';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    gqlModuleConfig,
    DbModule,
    AuthModule,
    PostModule,
    TagModule
  ]
})
export class AppModule {}
