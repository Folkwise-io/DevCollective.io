import { GraphQLSchema } from "graphql";

import QueryType from "./QueryType";
import MutationType from "./MutationType";

export default new GraphQLSchema({ query: QueryType, mutation: MutationType });
