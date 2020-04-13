import { Module } from '@nestjs/common';
import { ImagickProvider } from './imagick.provider';
import { ImagickNativeService } from './services/imagick-native.service';
import { ImagickBinaryService } from './services/imagick-binary.service';

@Module({
  providers: [
    ImagickBinaryService,
    ImagickNativeService,
    ImagickProvider
  ],
  exports: [
    ImagickProvider
  ]
})
export class ImagickModule {}
