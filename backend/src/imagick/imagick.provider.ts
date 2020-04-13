import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { ImagickNativeService } from './services/imagick-native.service';
import { ImagickBinaryService } from './services/imagick-binary.service';
import { ImagickInterface } from './services/imagick.interface';
import { MagickPath } from './binary-path';

@Injectable()
export class ImagickProvider {

  constructor(private readonly imagickNativeService: ImagickNativeService,
    private readonly imagickBinaryService: ImagickBinaryService) {}

  provide(): ImagickInterface {
    if (existsSync(MagickPath)) {
      return this.imagickBinaryService;
    } else {
      return this.imagickNativeService;
    }
  }

}
