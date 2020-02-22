// import * as Joi from 'joi';
// import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

// @Injectable()
// export class JoiValidationPipe implements PipeTransform {

//   constructor(private readonly schema) {}

//   transform(value: any, _: ArgumentMetadata) {
//     const { error } = Joi.validate(value, this.schema);

//     if (error) {
//       throw new BadRequestException();
//     }
//     return value;
//   }

// }
