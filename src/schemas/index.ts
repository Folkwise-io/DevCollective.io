import { GraphQLSchema } from "graphql";

import { RootMutation } from "./RootMutation";
import { RootQuery } from "./RootQuery";

export default new GraphQLSchema({ query: RootQuery, mutation: RootMutation });
