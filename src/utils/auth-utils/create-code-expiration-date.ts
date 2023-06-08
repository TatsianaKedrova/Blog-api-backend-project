import { add } from "date-fns";

export const createCodeExpirationDate = () => {
  return add(new Date(), {
    days: 1,
  }).toISOString();
};
