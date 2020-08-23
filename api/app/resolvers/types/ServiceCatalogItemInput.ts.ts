/** @format */

import { Length } from "class-validator";
import { ObjectId } from "mongodb";
import { Field, InputType } from "type-graphql";
import { ServiceCatalogItem } from "../../entities/ServiceCatalogItem";

@InputType()
export class ServiceCatalogItemInput implements Partial<ServiceCatalogItem> {

  @Field()
  name: String;

  @Field()
  @Length(1, 255)
  description: String;

  @Field({ nullable: true})
  serviceNumber?: number;

  @Field({ nullable: true})
  price?: number;

  @Field(() => String, {nullable: true})
  lead?: ObjectId;
}
