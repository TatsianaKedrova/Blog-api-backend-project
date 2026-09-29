import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Generates standard cookie options for the application
 * @param {number} maxAgeInMs - Optional override for cookie lifetime
 */
export const getCookieOptions = (
  maxAgeInMs: number = 30 * 60 * 1000,
): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: maxAgeInMs,
});
