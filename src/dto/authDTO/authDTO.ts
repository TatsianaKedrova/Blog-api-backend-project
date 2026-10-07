import { ObjectId } from "mongodb";
import { SecurityDevicesQueryRepository } from "../../repositories/query-repository/securityDevicesQueryRepository";
import { AuthQueryRepository } from "../../repositories/query-repository/authQueryRepository";

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

export type RegistrationEmailResending = {
  email: string; //^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$   Email of already registered but not confirmed user
};

export type RefreshTokensBlacklistDB = {
  _id: ObjectId;
  refreshTokensArray: string[];
};
export type AccessToken = string & { readonly __brand: unique symbol };
export type RefreshToken = string & { readonly __brand: unique symbol };
export type TokenPairResponse = {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
}

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
