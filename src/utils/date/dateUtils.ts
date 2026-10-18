import { add } from "date-fns";

export const createExpirationDate = (expiresIn: Duration) => {
  return add(new Date(), expiresIn);
};

export const creationDate = () => {
  return new Date(new Date().setHours(new Date().getHours() + 2)).toISOString();
};
