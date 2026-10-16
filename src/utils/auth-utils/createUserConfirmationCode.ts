import crypto from "node:crypto";

export const createConfirmationCode = (): string => {
  return crypto.randomUUID();
};

export const generateResetToken = () => {
  const rawToken = crypto.randomUUID();
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  return { rawToken, hashedToken };
};
