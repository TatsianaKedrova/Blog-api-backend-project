import { Types } from "mongoose";
import { UserDBType } from "../../dto/usersDTO/usersDTO";
import { inject, injectable } from "inversify";
import { UserModel } from "../../db/mongoose/models/user.model";

@injectable()
export class UsersCommandsRepository {
  constructor(
    @inject(UserModel) private readonly userModel: typeof UserModel,
  ) {}

  async createNewUser(
    newUser: Omit<UserDBType, "_id">,
  ): Promise<Types.ObjectId> {
    const createdUser = await this.userModel.create(newUser);
    return createdUser._id;
  }
  async deleteUser(id: string): Promise<boolean> {
    const deleteResult = await this.userModel.deleteOne({
      _id: id,
    });
    return deleteResult.deletedCount === 1;
  }
  async updateUserIsConfirmed(_id: Types.ObjectId): Promise<boolean> {
    const updatedUser = await this.userModel.updateOne(
      { _id },
      {
        $set: {
          "emailConfirmation.isConfirmed": true,
          "emailConfirmation.confirmationCode": null,
          "emailConfirmation.expirationDate": null,
        },
      },
    );
    return updatedUser.matchedCount === 1;
  }
  async updateUserPassResetCodeAndExpiration(
    userId: Types.ObjectId,
    hashedToken: string,
    expirationDate: Date,
  ) {
    const result = await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          "passwordConfirmation.passwordResetHash": hashedToken,
          "passwordConfirmation.passwordResetExpires": expirationDate,
        },
      },
    );
    return result.matchedCount === 1;
  }
  async updateConfirmationCodeAndExpirationDate(
    id: string,
    code: string,
    expirationDate: Date,
  ): Promise<boolean> {
    const updatedUser = await this.userModel.updateOne(
      { _id: id },
      {
        $set: {
          "emailConfirmation.confirmationCode": code,
          "emailConfirmation.expirationDate": expirationDate,
        },
      },
    );
    return updatedUser.matchedCount === 1;
  }
  async updatePasswordByResetHash(
    hashedToken: string,
    passwordSalt: string,
    passwordHash: string,
  ): Promise<boolean> {
    const user = await this.userModel
      .findOneAndUpdate<UserDBType>(
        {
          "passwordConfirmation.passwordResetHash": hashedToken,
          "passwordConfirmation.passwordResetExpires": { $gt: new Date() },
        },
        {
          $set: {
            "accountData.passwordSalt": passwordSalt,
            "accountData.passwordHash": passwordHash,
          },
          $unset: {
            "passwordConfirmation.passwordResetHash": 1,
            "passwordConfirmation.passwordResetExpires": 1,
          },
        },
      )
      .select("_id")
      .lean();
    return !!user;
  }
}
