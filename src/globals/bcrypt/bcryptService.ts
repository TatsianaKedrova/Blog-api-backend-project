import bcrypt from "bcryptjs";

export const bcryptService = {
  async _generateHash(password: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, passwordSalt);
    return { passwordSalt, passwordHash };
  },
  async _passwordComparison(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  },
};
