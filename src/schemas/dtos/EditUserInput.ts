import { GraphQLInputObjectType, GraphQLString } from "graphql";

const EditUserInput = new GraphQLInputObjectType({
  name: `EditUserInput`,
  fields: {
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
  },
});

export default EditUserInput;
