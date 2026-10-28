import { model, Schema, Types } from "mongoose";
import { RefreshTokensBlacklistDB } from "../../../dto/authDTO/authDTO";

export const blacklistedRefreshTokenSchema =
  new Schema<RefreshTokensBlacklistDB>(
    {
      userId: { type: Types.ObjectId, required: true, index: true },
      token: {
        type: String,
        required: true,
        minLength: 10,
        trim: true,
        index: true,
      },
      invalidatedAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 172800,
      },
    },
    {
      versionKey: false,
    },
  );

export const BlacklistedRefreshTokenModel = model<RefreshTokensBlacklistDB>(
  "BlacklistedRefreshToken",
  blacklistedRefreshTokenSchema,
  "blacklistedRefreshTokens",
);
