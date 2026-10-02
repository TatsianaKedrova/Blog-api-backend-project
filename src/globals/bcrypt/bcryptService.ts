import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function generateHash(password: string) {
  const passwordSalt = await bcrypt.genSalt(SALT_ROUNDS);
  const passwordHash = await bcrypt.hash(password, passwordSalt);
  return { passwordSalt, passwordHash };
}
export async function comparePasswords(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash);
}
