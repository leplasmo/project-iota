/** @format */

import { ObjectId } from 'mongodb';
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import {
  ServiceCatalogItem,
  ServiceCatalogItemModel,
} from '../entities/ServiceCatalogItem';
import { User, UserModel } from '../entities/User';
import { ObjectIdScalar } from '../object-id.scalar';
import { ServiceCatalogItemInput } from './types/ServiceCatalogItemInput.ts';

@Resolver((_of) => ServiceCatalogItem)
export class ServiceCatalogItemResolver {
  @Query((_returns) => ServiceCatalogItem, { nullable: false })
  async getServiceCatalogItem(
    @Arg('id', (_type) => ObjectIdScalar) id: ObjectId,
  ) {
    return await ServiceCatalogItemModel.findById(id);
  }

  @Query((_returns) => [ServiceCatalogItem])
  async getServiceCatalogItems(): Promise<ServiceCatalogItem[]> {
    return await ServiceCatalogItemModel.find({});
  }

  @Mutation((_returns) => ServiceCatalogItem)
  async addServiceCatalogItem(
    @Arg('data') serviceCatalogInput: ServiceCatalogItemInput,
  ): Promise<ServiceCatalogItem> {
    try {
      // create the new item
      const newServiceCatalogItem = new ServiceCatalogItemModel({
        ...serviceCatalogInput,
        lead: new ObjectId('5f42920460c3671348725259'),
      } as ServiceCatalogItem);

      await newServiceCatalogItem.save();

      // also add the reference in the user object
      const owner = await UserModel.findById('5f42920460c3671348725259');
      if (!owner) {
        console.error('Could not find the user in the database');
        throw new Error('Error while adding the service owner');
      }
      const ownerUpdated = await owner.save();
      if (!ownerUpdated) {
        throw new Error('Error while saving the owner information');
      }
      owner.createdServices.push(newServiceCatalogItem._id);
      return newServiceCatalogItem;
    } catch (error) {
      console.error(
        'There was an error while creating the service catalog item',
      );
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async removeServiceCatalogItem(
    @Arg('id', (_type) => ObjectIdScalar) id: ObjectId,
  ) {
    const result = await ServiceCatalogItemModel.findByIdAndDelete(id);
    if (!result) {
      // either there was an error while deleting or the doc didn't exist
      return false;
    }
    return true;
  }

  @FieldResolver()
  async lead(@Root() serviceCatalogItem: ServiceCatalogItem): Promise<User> {
    return (await UserModel.findById(serviceCatalogItem._doc.lead))!;
  }
}
