import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ObjectID } from 'bson';

@Injectable()
export class ObjectIDPipe implements PipeTransform {

  transform(value: any, _: ArgumentMetadata) {
    return new ObjectID((value || '').toString());
  }

}
