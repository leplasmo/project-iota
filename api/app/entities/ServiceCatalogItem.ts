/** @format */

import { getModelForClass, prop as Property } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Ref } from '../types';
import { User } from './User';

@ObjectType({ description: 'The Service Catalog Items' })
export class ServiceCatalogItem {
  @Field(() => ID!)
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  name: string;

  @Field()
  @Property({ required: true })
  description: string;

  @Field((_type) => Int, { nullable: true })
  @Property()
  serviceNumber: number;

  @Field((_type) => Int, { nullable: true })
  @Property()
  price: number;

  @Field((_type) => User)
  @Property({ ref: User, required: true })
  lead: Ref<User>;
  _doc: any;
}

export const ServiceCatalogItemModel = getModelForClass(ServiceCatalogItem);
