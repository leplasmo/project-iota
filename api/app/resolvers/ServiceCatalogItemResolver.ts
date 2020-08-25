/** @format */

import { ObjectId } from 'mongodb';
import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { ServiceCatalogItem, ServiceCatalogItemModel } from '../entities/ServiceCatalogItem';
import { User, UserModel } from '../entities/User';
import { ObjectIdScalar } from '../object-id.scalar';
import { ServiceCatalogItemInput } from './types/ServiceCatalogItemInput.ts';
import { ServiceCatalogItemUpdateInput } from './types/ServiceCatalogItemUpdateInput';

@Resolver((_of) => ServiceCatalogItem)
export class ServiceCatalogItemResolver {
  @Query((_returns) => ServiceCatalogItem, { nullable: false })
  async getServiceCatalogItem(@Arg('id', (_type) => ObjectIdScalar) id: ObjectId) {
    return await ServiceCatalogItemModel.findById(id);
  }

  @Query((_returns) => [ServiceCatalogItem])
  async getServiceCatalogItems(): Promise<ServiceCatalogItem[]> {
    return await ServiceCatalogItemModel.find({});
  }

  @Mutation((_returns) => ServiceCatalogItem)
  async addServiceCatalogItem(@Arg('data') serviceCatalogInput: ServiceCatalogItemInput): Promise<ServiceCatalogItem> {
    try {
      // create the new item
      const newServiceCatalogItem = new ServiceCatalogItemModel({
        ...serviceCatalogInput,
        owner: new ObjectId('5f440b7b305ccc1434bc29da'),
      } as ServiceCatalogItem);

      await newServiceCatalogItem.save();

      // also add the reference in the user object
      const owner = await UserModel.findById('5f440b7b305ccc1434bc29da');
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
      console.error('There was an error while creating the service catalog item');
      throw error;
    }
  }

  @Mutation((_returns) => ServiceCatalogItem)
  async updateServiceCatalogItem(
    @Arg('id', (_type) => ObjectIdScalar) id: ObjectId,
    @Arg('data', (_type) => ServiceCatalogItemUpdateInput)
    data: ServiceCatalogItemUpdateInput,
  ): Promise<ServiceCatalogItem> {
    try {
      const serviceCatalogItem = await ServiceCatalogItemModel.findByIdAndUpdate(
        id,
        {
          ...data,
        },
        {
          new: true,
        },
      );
      if (!serviceCatalogItem) {
        throw new Error('not found');
      }
      return serviceCatalogItem;
      //   const serviceCatalogItem = await ServiceCatalogItemModel.findById(id);
      //   if (!serviceCatalogItem) {
      //     throw new Error(`Could not find the service catalog item [ ${id} ]`);
      //   }
      //   await serviceCatalogItem.updateOne({
      //     ...data,
      //   });
      //   const serviceCatalogItemUpdated = await serviceCatalogItem.save();
      //   if (!serviceCatalogItemUpdated) {
      //     throw new Error(`Could not update the service catalog item [ ${id} ]`);
      //   }
      //   return (serviceCatalogItemUpdated as unknown) as ServiceCatalogItem;
    } catch (error) {
      console.error('There was an error while updating the service catalog item');
      throw error;
    }
  }

  @Mutation((_returns) => Boolean)
  async removeServiceCatalogItem(@Arg('id', (_type) => ObjectIdScalar) id: ObjectId): Promise<boolean> {
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
