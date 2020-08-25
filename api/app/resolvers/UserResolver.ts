/** @format */
import { ObjectId } from 'mongodb';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { User, UserModel } from '../entities/User';
import { ObjectIdScalar } from '../object-id.scalar';
import { UserInput } from './types/UserInput';

const capitalizeFirstLetter = (input: string): string => {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};
@Resolver((_of) => User)
export class UserResolver {
  @Query((_returns) => User, { nullable: false })
  async getUser(@Arg('id', (_type) => ObjectIdScalar) id: ObjectId) {
    return await UserModel.findById(id);
  }

  @Query((_returns) => [User])
  async getUsers(): Promise<User[]> {
    return await UserModel.find({});
  }

  @Mutation((_returns) => User)
  async addUser(@Arg('data') userInput: UserInput): Promise<User> {
    try {
      const newUser = new UserModel(({
        ...userInput,
        firstName: capitalizeFirstLetter(userInput.firstName),
        lastName: capitalizeFirstLetter(userInput.lastName),
      } as unknown) as User);

      await newUser.save();
      return newUser;
    } catch (error) {
      console.error('There was an error while creating the user');
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id') id: string) {
    await UserModel.deleteOne({ id });
    return true;
  }

  // @FieldResolver((_type) => [ServiceCatalogItem])
  // async createdServices(@Root() user: User): Promise<ServiceCatalogItem[]> {
  //   console.log(user, "user!");
  //   return (await ServiceCatalogItemModel.findById(user._doc.createdServices))!;
  // }
}
