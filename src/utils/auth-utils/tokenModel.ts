import { LoginSuccessViewModel } from "../../dto/authDTO/authDTO";

export const makeTokenModel = (token: string): LoginSuccessViewModel => {
  return {
    accessToken: token,
  };
};
