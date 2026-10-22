import mongoose, { model, Schema } from "mongoose";
import { UserDBType } from "../../../dto/usersDTO/usersDTO";

const userSchema = new Schema<UserDBType>({
  accountData: {
    login: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    createdAt: { type: Date, required: true },
    passwordHash: { type: String, required: true, select: false },
    passwordSalt: { type: String, required: true, select: false },
  },
  emailConfirmation: {
    isConfirmed: { type: Boolean },
    confirmationCode: { type: String, default: null },
    expirationDate: { type: Date, default: null },
  },
  isAddedBySuperAdmin: { type: Boolean, required: true },
  passwordConfirmation: {
    passwordResetHash: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
});
userSchema.index(
  {
    "passwordConfirmation.passwordResetHash": 1,
    "passwordConfirmation.passwordResetExpires": 1,
  },
  { name: "password_reset_lookup", sparse: true },
);
export const UserModel = model("User", userSchema);
