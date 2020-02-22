import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectID } from 'bson';

export const ID = new GraphQLScalarType({
  name: 'ID',
  description: 'Object ID',

  serialize(value) {
    if (typeof value == 'string') {
      return value;
    } else if (value && value.toHexString) {
      return (value as ObjectID).toHexString();
    }
  },

  parseValue(value) {
    if (typeof value == 'string') {
      return new ObjectID(value);
    }
  },

  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING: return new ObjectID(ast.value);
    }
  }
});
