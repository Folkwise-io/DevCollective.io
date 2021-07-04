import { Arg, Query, Resolver } from "type-graphql";

import { User } from "./user.entity";

@Resolver()
export class UserResolver {
  @Query(() => User)
  async user(@Arg(`id`) id: number) {
    return {
      id: 325,
      firstName: `Brandon`,
      lastName: `Tsang`,
    };
  }
}
