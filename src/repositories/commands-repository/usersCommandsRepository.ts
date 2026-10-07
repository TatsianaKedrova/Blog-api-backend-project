import { ObjectId } from "mongodb";
import { usersCollection } from "../../db";
import { UserDBType } from "../../dto/usersDTO/usersDTO";
import { UsersQueryRepository } from "../query-repository/usersQueryRepository";

export class UsersCommandsRepository {
  constructor(
    private readonly usersQueryRepository = new UsersQueryRepository(),
  ) {}

  async createNewUser(newUser: UserDBType): Promise<ObjectId> {
    const createdUser = await usersCollection.insertOne(newUser);
    return createdUser.insertedId;
  }
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.usersQueryRepository.findUserById(id);
    if (!user) return false;

    const deleteResult = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  }
  async updateUserIsConfirmed(_id: ObjectId): Promise<boolean> {
    const updateIsUserConfirmed = await usersCollection.updateOne(
      { _id },
      {
        $set: {
          "emailConfirmation.isConfirmed": true,
          "emailConfirmation.confirmationCode": null,
          "emailConfirmation.expirationDate": null,
        },
      },
    );
    return updateIsUserConfirmed.modifiedCount === 1;
  }
  async updateUserCodeAndExpirationDate(
    _id: ObjectId,
    code: string,
    expirationDate: string,
  ): Promise<boolean> {
    const findUser = this.usersQueryRepository.findUserById(_id.toString());
    if (!findUser) return false;
    const updateIsUserConfirmed = await usersCollection.updateMany(
      { _id },
      {
        $set: {
          "emailConfirmation.confirmationCode": code,
          "emailConfirmation.expirationDate": expirationDate,
        },
      },
    );
    return updateIsUserConfirmed.modifiedCount === 1;
  }
}
