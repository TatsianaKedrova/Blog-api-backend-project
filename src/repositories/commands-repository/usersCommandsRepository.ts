import { Types } from "mongoose";
import { UserDBType } from "../../dto/usersDTO/usersDTO";
import { UsersQueryRepository } from "../query-repository/usersQueryRepository";
import { inject, injectable } from "inversify";
import { UserModel } from "../../db/mongoose/models/user.model";

@injectable()
export class UsersCommandsRepository {
  constructor(
    @inject(UsersQueryRepository)
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async createNewUser(newUser: UserDBType): Promise<Types.ObjectId> {
    const createdUser = await UserModel.create(newUser);
    return createdUser._id;
  }
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.usersQueryRepository.findUserById(id);
    if (!user) return false;

    const deleteResult = await UserModel.deleteOne({
      _id: id,
    });
    return deleteResult.deletedCount === 1;
  }
  async updateUserIsConfirmed(_id: Types.ObjectId): Promise<boolean> {
    const updateIsUserConfirmed = await UserModel.updateOne(
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
  async updateUserPassCodeAndPassExpiration(
    userId: Types.ObjectId,
    hashedToken: string,
    expirationDate: Date,
  ) {
    await UserModel.updateMany(
      { _id: userId },
      {
        $set: {
          passwordConfirmation: {
            passwordResetHash: hashedToken,
            passwordResetExpires: expirationDate,
          },
        },
      },
    );
  }
  async updateUserCodeAndExpirationDate(
    id: string,
    code: string,
    expirationDate: Date,
  ): Promise<boolean> {
    const findUser = await this.usersQueryRepository.findUserById(id);
    if (!findUser) return false;
    const updateIsUserConfirmed = await UserModel.updateMany(
      { _id: id },
      {
        $set: {
          "emailConfirmation.confirmationCode": code,
          "emailConfirmation.expirationDate": expirationDate,
        },
      },
    );
    return updateIsUserConfirmed.modifiedCount === 1;
  }
  async updatePasswordByResetHash(
    hashedToken: string,
    passwordSalt: string,
    passwordHash: string,
  ): Promise<boolean> {
    const userId = (await UserModel.findOne({
      "passwordConfirmation.passwordResetHash": hashedToken,
      "passwordConfirmation.passwordResetExpires": { $gt: new Date() },
    })
      .select("_id")
      .lean()) as { _id: Types.ObjectId } | null;
    if (!userId) {
      return false;
    }
    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          "accountData.passwordSalt": passwordSalt,
          "accountData.passwordHash": passwordHash,
        },
        $unset: {
          "passwordConfirmation.passwordResetHash": 1,
          "passwordConfirmation.passwordResetExpires": 1,
          "passwordConfirmation.passwordResetAttempts": 1,
        },
      },
    );
    return true;
  }
}
