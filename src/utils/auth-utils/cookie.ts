import { CookieOptions } from "express";
/**
 * Generates standard cookie options for the application
 * @param {number} maxAgeInMs - Optional override for cookie lifetime
 */
export const getCookieOptions = (
  maxAgeInMs: number = 30 * 60 * 1000,
): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  maxAge: maxAgeInMs,
});

export const getClearCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
});
