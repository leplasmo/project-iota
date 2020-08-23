/** @format */

import { getModelForClass, prop as Property, Ref } from "@typegoose/typegoose";
import { ObjectId } from 'mongodb';
import { Field, ID, ObjectType } from "type-graphql";
import { ServiceCatalogItem } from "./ServiceCatalogItem";

@ObjectType({ description: "The User model" })
export class User {
  @Field(() => ID!)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  username: String;

  @Field()
  @Property({ required: true })
  email: String;

  @Field((_type) => [ServiceCatalogItem])
  @Property({ type: ServiceCatalogItem, default: [] })
  createdServices: Ref<ServiceCatalogItem>[];
  _doc: any;
  
}

export const UserModel = getModelForClass(User);
