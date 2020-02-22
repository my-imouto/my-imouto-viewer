import { Injectable } from '@nestjs/common';
import { AppConfigStructure } from './app-config-structure';

@Injectable()
export class AppConfig {

  get env(): AppConfigStructure { return process.env as any; }

}
