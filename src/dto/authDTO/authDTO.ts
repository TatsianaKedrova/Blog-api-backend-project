import { SecurityDevicesQueryRepository } from "../../repositories/query-repository/securityDevicesQueryRepository";
import { AuthQueryRepository } from "../../repositories/query-repository/authQueryRepository";
import { Types } from "mongoose";

export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type MeViewModel = {
  email: string;
  login: string;
  userId: string;
};

export type LoginSuccessViewModel = {
  accessToken: string; //jwt token
};

export type RegistrationConfirmationCodeModel = {
  code: string; //Code that be sent via Email inside link
};

export type EmailRequest = {
  email: string; //^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$   Email of already registered but not confirmed user
};

export type RefreshTokensBlacklistDB = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  invalidatedAt: Date
};
export type AccessToken = string & { readonly __brand: unique symbol };
export type RefreshToken = string & { readonly __brand: unique symbol };
export type TokenPairResponse = {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
};

export type AccessTokenPayloadType = {
  userId: string;
};
export type RefreshTokenPayloadType = AccessTokenPayloadType & {
  deviceId: string;
  iat?: number;
};

export interface RefreshTokenMiddlewareDeps {
  securityDevicesQueryRepository: SecurityDevicesQueryRepository;
  authQueryRepository: AuthQueryRepository;
}

export type NewPasswordRecoveryInputModel = {
  newPassword: string;
  recoveryCode: string;
};
