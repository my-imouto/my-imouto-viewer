import { Injectable } from '@nestjs/common';
import { ImagickInterface, IdentifyResult } from './imagick.interface';
import { spawn } from 'child_process';
import * as tmp from 'tmp';
import { writeFileSync, readFileSync } from 'fs';
import { MagickPath } from '../binary-path';

@Injectable()
export class ImagickBinaryService implements ImagickInterface {

  resize(srcData: Buffer, width: number, height: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        tmp.file((err, path, fd, cleanupCallback) => {
          if (err) {
            console.log('error 2')
            reject(err);
            return;
          }

          writeFileSync(path, srcData);

          const id = spawn(MagickPath, [
              'convert',
              path,
              `-resize`, `${width}x${height}`,
              `jpeg:${path}`
            ]);

          id.stderr.on('data', data => reject(data.toString()));

          id.on('exit', async (c) => {
            resolve(await readFileSync(path))
            cleanupCallback()
          });
        });
    });
  }

  thumbnail(srcData: Buffer, size: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      tmp.file((err, path, fd, cleanupCallback) => {
        if (err) {
          reject(err);
          return;

        }

        writeFileSync(path, srcData);

        const id = spawn(MagickPath, [
            'convert',
            path,
            `-resize`, `${size}x${size}^`,
            '-gravity', 'center',
            `-extent`, `${size}x${size}`,
            `jpeg:${path}`
          ]);

        id.stderr.on('data', data => reject(data.toString()));

        id.on('exit', async (c) => {
          resolve(await readFileSync(path))
          cleanupCallback()
        });
      });
    });
  }

  identify(srcData: Buffer): Promise<IdentifyResult> {
    return new Promise((resolve, reject) => {
      tmp.file((err, path, fd, cleanupCallback) => {
        if (err) {
          reject(err);
          return;
        }

        writeFileSync(path, srcData);

        const id = spawn(MagickPath, ['identify', path]);

        id.stdout.on('data', data => {
          const output = data.toString().split(' ');
          const [width, height] = output[2].split('x');
          const format = output[1];

          resolve({
            width: parseInt(width),
            height: parseInt(height),
            format
          });
        });

        id.stderr.on('data', data => reject(data));

        id.on('exit', () => cleanupCallback());
      });
    });
  }

}
