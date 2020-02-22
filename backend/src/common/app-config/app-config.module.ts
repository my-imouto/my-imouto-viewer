import { Module } from '@nestjs/common';
import { AppConfig } from './app-config';

@Module({
  exports: [ AppConfig ],
  providers: [ AppConfig ],
})
export class AppConfigModule {}
