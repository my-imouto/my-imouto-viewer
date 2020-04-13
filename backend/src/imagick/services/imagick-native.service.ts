import { Injectable } from '@nestjs/common';
import { ImagickInterface, IdentifyResult } from './imagick.interface';

@Injectable()
export class ImagickNativeService implements ImagickInterface {

  constructor() {}

  resize(srcData: Buffer, width: number, height: number) {
    return Promise.resolve(require('imagemagick-native').convert({
      srcData,
      width,
      height,
      resizeStyle: 'aspectfit'
    }));
  }

  thumbnail(srcData: Buffer, size: number) {
    return Promise.resolve(require('imagemagick-native').convert({
      srcData,
      width: size,
      height: size,
      resizeStyle: 'aspectfill',
      gravity: 'Center'
    }));
  }

  identify(srcData: Buffer): Promise<IdentifyResult> {
    return new Promise((resolve, reject) => {
      require('imagemagick-native').identify({ srcData }, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve({
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      })
    });
  }

}
