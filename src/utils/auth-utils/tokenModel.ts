import { LoginSuccessViewModel } from "../../dto/authDTO/authDTO";

export const createTokenModel = (token: string): LoginSuccessViewModel => {
  return {
    accessToken: token,
  };
};
