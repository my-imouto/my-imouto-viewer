import { Injectable } from '@nestjs/common';
import { User } from 'src/user';
import * as Md5 from 'md5';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { parse as parsePath, resolve } from 'path';
import { PostModelName, Post } from '../schema/post.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as Imagick from 'imagemagick-native';
import { TagModelName, Tag } from 'src/tag';
import { TagService } from 'src/tag/services/tag.service';

interface IdentifyResult {
  format: string,
  width: number,
  height: number
}

@Injectable()
export class PostProcessor {

  readonly previewMaxWidth = 236;
  readonly previewMaxHeight = 300;

  readonly sampleMaxWidth = 960;
  readonly sampleMaxHeight = 1220;

  readonly thumbnailSize = 96;

  constructor(@InjectModel(PostModelName) private readonly Post: Model<Post>,
    @InjectModel(TagModelName) private readonly Tag: Model<Tag>,
    private readonly TagService: TagService) {}

  processFile(user: User, path: string) {
    return this.process(user, readFileSync(path), parsePath(path).base);
  }

  async process(user: User, buffer: Buffer, fileName?: string) {
    const md5: string = Md5(buffer);
    let post = await this.Post.findOne({ md5 });

    if (post) {
      return post;
    }

    post = new this.Post();
    post.user = user._id;
    post.md5 = md5;

    const subDirs = `${md5.substr(0, 2)}/${md5.substr(2, 2)}`;
    const destName = `/${md5}.jpg`;

    // Image
    let path = resolve(process.cwd() + `/../public/image/${subDirs}`);
    if (!existsSync(path)) {
      mkdirSync(path, {recursive: true});
    }
    writeFileSync(path + destName, buffer);
    let data = await this.identifyImage(buffer);
    post.width = data.width;
    post.height = data.height;

    // Sample
    const result = await this.resizeToSample(buffer);
    if (result.resized) {
      buffer = result.buffer;

      path = resolve(process.cwd() + `/../public/sample/${subDirs}`);
      if (!existsSync(path)) {
        mkdirSync(path, {recursive: true});
      }
      writeFileSync(path + destName, buffer);
      data = await this.identifyImage(buffer);
      post.sampleWidth = data.width;
      post.sampleHeight = data.height;
    }

    // Preview
    buffer = await this.resizeToPreview(buffer);
    path = resolve(process.cwd() + `/../public/preview/${subDirs}`);
    if (!existsSync(path)) {
      mkdirSync(path, {recursive: true});
    }
    writeFileSync(path + destName, buffer);
    data = await this.identifyImage(buffer);
    post.previewWidth = data.width;
    post.previewHeight = data.height;

    // Thumbnail
    buffer = this.resizeToThumbnail(buffer);
    path = resolve(process.cwd() + `/../public/thumbnail/${subDirs}`);
    if (!existsSync(path)) {
      mkdirSync(path, {recursive: true});
    }
    writeFileSync(path + destName, buffer);

    if (fileName) {
      await this.processFilename(post, fileName);
    }

    await post.save();

    return post;
  }

  private identifyImage(srcData: Buffer): Promise<IdentifyResult> {
    return new Promise((resolve, reject) => {
      Imagick.identify({ srcData }, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    });
  }

  private async resizeToSample(srcData: Buffer) {
    const data = await this.identifyImage(srcData);

    if (data.width > this.sampleMaxWidth || data.height > this.sampleMaxHeight) {
      return {
        buffer: Imagick.convert({
          srcData,
          width: this.sampleMaxWidth,
          height: this.sampleMaxHeight,
          resizeStyle: 'aspectfit'
        }),
        resized: true
      };
    }

    return {
      buffer: srcData,
      resized: false
    };
  }

  private async resizeToPreview(srcData: Buffer) {
    return Imagick.convert({
      srcData,
      width: this.previewMaxWidth,
      height: this.previewMaxHeight,
      resizeStyle: 'aspectfit'
    });
  }

  private resizeToThumbnail(srcData: Buffer) {
    return Imagick.convert({
      srcData,
      width: this.thumbnailSize,
      height: this.thumbnailSize,
      resizeStyle: 'aspectfill',
      gravity: 'Center'
    });
  }

  private async processFilename(post: Post, fileName: string) {
    const m = fileName.match(/^yande.re \d+ (.*?)\.jpg$/);

    if (!m) {
      post.tags = ['tagme'];
    } else {
      const tagNames = m[1].split(' ');
      const tags = await this.TagService.createMany(tagNames);

      post.tags = tags.map(t => t.name);
    }
  }

}
