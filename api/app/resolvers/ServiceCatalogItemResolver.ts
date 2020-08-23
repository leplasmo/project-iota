/** @format */

import { ObjectId } from "mongodb";
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql";
import { ServiceCatalogItem, ServiceCatalogItemModel } from "../entities/ServiceCatalogItem";
import { User, UserModel } from "../entities/User";
import { ObjectIdScalar } from "../object-id.scalar";
import { ServiceCatalogItemInput } from "./types/ServiceCatalogItemInput.ts";


@Resolver((_of) => ServiceCatalogItem)
export class ServiceCatalogItemResolver {
  @Query((_returns) => ServiceCatalogItem, { nullable: false })
  async getServiceCatalogItem(
    @Arg("id", (_type) => ObjectIdScalar) id: ObjectId
  ) {
    return await ServiceCatalogItemModel.findById(id);
  }

  @Query((_returns) => [ServiceCatalogItem])
  async getServiceCatalogItems(): Promise<ServiceCatalogItem[]> {
    return await ServiceCatalogItemModel.find({});
  }

  @Mutation((_returns) => ServiceCatalogItem)
  async addServiceCatalogItem(
    @Arg("data") serviceCatalogInput: ServiceCatalogItemInput
  ): Promise<ServiceCatalogItem> {
    try {
      const newServiceCatalogItem = new ServiceCatalogItemModel({
        ...serviceCatalogInput,
        lead: new ObjectId("5f42920460c3671348725259"),
      } as ServiceCatalogItem);

      await newServiceCatalogItem.save();
      return newServiceCatalogItem;
    } catch (error) {
      console.error(
        "There was an error while creating the service catalog item"
      );
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async removeServiceCatalogItem(
    @Arg("id", (_type) => ObjectIdScalar) id: ObjectId
  ) {
    const result = await ServiceCatalogItemModel.findByIdAndDelete(id);
    if (!result) { // either there was an error while deleting or the doc didn't exist
      return false
    }
    return true;
  }

  @FieldResolver()
  async lead(@Root() serviceCatalogItem: ServiceCatalogItem): Promise<User> {
    return (await UserModel.findById(serviceCatalogItem._doc.lead))!;
  }
}
