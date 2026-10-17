import crypto from "node:crypto";

export const createConfirmationCode = (): string => {
  return crypto.randomUUID();
};

export const generateResetToken = () => {
  const rawToken = crypto.randomUUID();
  const hashedToken = generateHashedToken(rawToken);
  return { rawToken, hashedToken };
};

export const generateHashedToken = (rawToken: string) => {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};
