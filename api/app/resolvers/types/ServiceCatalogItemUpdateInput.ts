/** @format */

import { Length } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Field, InputType, Int } from 'type-graphql';
import { ServiceCatalogItem } from '../../entities/ServiceCatalogItem';

// for updates, all fields are optional
@InputType()
export class ServiceCatalogItemUpdateInput implements Partial<ServiceCatalogItem> {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  @Length(1, 255)
  description?: string;

  @Field(() => Int, { nullable: true })
  serviceNumber?: number;

  @Field(() => Int, { nullable: true })
  price?: number;

  @Field(() => String, { nullable: true }) // is added by the mutation
  owner?: ObjectId;

  @Field(() => String, { nullable: true })
  lead?: ObjectId;

  @Field(() => String, { nullable: true })
  deputyLead?: ObjectId;
}
