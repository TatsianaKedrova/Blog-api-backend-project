import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../db";
import { UserDBType, UserViewModel } from "../../dto/usersDTO/usersDTO";
import { transformUsersResponse } from "../../utils/usersUtils/transformUsersResponse";

export const usersCommandsRepository = {
  async createNewUser(newUser: UserDBType): Promise<UserViewModel> {
    const createdUser = await usersCollection.insertOne(newUser);
    return transformUsersResponse(newUser, createdUser.insertedId.toString());
  },
  async findUserById(id: string): Promise<WithId<UserDBType> | null> {
    const foundUser = await usersCollection.findOne({ _id: new ObjectId(id) });
    return foundUser;
  },
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.findUserById(id);
    if (!user) return false;

    const deleteResult = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
};
