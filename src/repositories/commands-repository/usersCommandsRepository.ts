import { MongoServerError, ObjectId } from "mongodb";
import { usersCollection } from "../../db";
import { UserDBType, UserViewModel } from "../../dto/usersDTO/usersDTO";
import { transformUsersResponse } from "../../utils/usersUtils/transformUsersResponse";
import { defineFieldMongoError } from "../../utils/errors-utils/defineFieldMongoError";
import { UserNotRegisteredField } from "../../dto/common/MongoErrorTypes";
import { usersQueryRepository } from "../query-repository/usersQueryRepository";

export const usersCommandsRepository = {
  async createNewUser(
    newUser: UserDBType,
  ): Promise<UserViewModel | UserNotRegisteredField> {
    try {
      const createdUser = await usersCollection.insertOne(newUser);
      return transformUsersResponse({
        _id: createdUser.insertedId,
        ...newUser,
      });
    } catch (err) {
      const error = err as MongoServerError;
      return defineFieldMongoError(error.message);
    }
  },
  async deleteUser(id: string): Promise<boolean> {
    const user = await usersQueryRepository.findUserById(id);
    if (!user) return false;

    const deleteResult = await usersCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
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
  },
  async updateUserCodeAndExpirationDate(
    _id: ObjectId,
    code: string,
    expirationDate: string,
  ): Promise<boolean> {
    const findUser = usersQueryRepository.findUserById(_id.toString());
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
  },
};
