import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  id!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;
}
