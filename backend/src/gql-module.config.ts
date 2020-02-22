import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ID } from  './common/graphql/id/id.type';
import { TagTypeResolver } from './tag';

export const gqlModuleConfig = GraphQLModule.forRoot({
  debug: process.env.DEBUG == 'true',
  playground: process.env.DEBUG == 'true',
  typePaths: ['./**/*.graphql'],
  definitions: {
    path: join(process.cwd(), 'src/graphql.ts'),
    outputAs: 'class',
  },
  resolvers: {
    ID,
    TagType: TagTypeResolver
  },
  context: ({ req }) => ({ req })
});
