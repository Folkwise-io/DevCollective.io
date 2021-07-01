import { User } from "src/entities/user.entity";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver(User)
export class UserResolver {
  @Query((returns) => User)
  async user(@Arg(`id`) id: string) {
    const user: User = {
      id: `fj83w9tjg`,
      firstName: `Brandon`,
      lastName: `Tsang`,
    };

    return user;
  }
}
