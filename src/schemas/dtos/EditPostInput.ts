import { GraphQLID, GraphQLInputObjectType, GraphQLString } from "graphql";

const x = 1;

const EditPostInput = new GraphQLInputObjectType({
  name: `EditPostInput`,
  fields: () => {
    return {
      title: {
        type: GraphQLString,
      },
      body: {
        type: GraphQLString,
      },
    };
  },
});

export default EditPostInput;
