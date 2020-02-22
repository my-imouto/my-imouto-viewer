import { ClassType } from 'class-transformer/ClassTransformer';
import { plainToClass } from 'class-transformer';
import { validate as cvValidate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

/**
 * This function was created to manually validate GraphQL input arguments
 * inside a Resolver's function, since Pipes don't work with GraphQL.
 *
 * If the validation fails, a BadRequestException is thrown, and the message
 * is an array of all the errors.
 *
 * Returns the validatable class instance.
 *
 * Usage:
 *
 * ````
 * @Resolver('Foo')
 * class FooResolver {
 *   @Mutation()
 *   async fooMutation(@Args() args: ValitableClass) {
 *     const data = await validate(args, ValitableClass);
 *
 *     // the above line is the same as doing this:
 *
 *     const data = plainToClass(ValitableClass, args);
 *     await validate(data);
 *   }
 * }
 * ```
 */
export async function validate<T>(data: any, cls: ClassType<T>): Promise<T> {
  return validateClass(plainToClass(cls, data));
}

export async function validateClass<T>(input: any): Promise <T> {
  const errors = await cvValidate(input);

  if (errors.length) {
    const messages = errors.map(e =>
      Object.keys(e.constraints).map(key => e.constraints[key]));

    throw new BadRequestException(messages.flat());
  }

  return input;
}
