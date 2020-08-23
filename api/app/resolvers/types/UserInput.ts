/** @format */

import { IsEmail, Length } from "class-validator";
import { ObjectId } from "mongodb";
import { Field, InputType } from "type-graphql";
import { User } from "../../entities/User";

@InputType()
export class UserInput implements Partial<User> {
  
  @Field()
  @Length(1, 255)
  username: String;

  @Field()
  @IsEmail()
  email: String;

  @Field(() => [String!]!, {nullable: true})
  //@Field(()=>[ID!]!)
  createdServices: [ObjectId];
}
