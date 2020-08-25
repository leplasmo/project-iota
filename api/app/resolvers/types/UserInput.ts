/** @format */

import { IsEmail, IsUrl, Length } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Field, InputType } from 'type-graphql';
import { User } from '../../entities/User';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  @Length(1, 255)
  username: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsUrl()
  avatar?: string;

  @Field(() => [String!]!, { nullable: true })
  //@Field(()=>[ID!]!)
  createdServices?: [ObjectId];
}
