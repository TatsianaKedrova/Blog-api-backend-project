import { UAParser } from "ua-parser-js";

export const getDeviceTitle = (userAgent: string | undefined) => {
  const rawUa = userAgent || "";
  const parser = new UAParser(rawUa).getResult();
  const deviceTitle = rawUa.includes("Postman")
    ? "Postman Client"
    : `${parser.browser.name || "Unknown Browser"} on ${parser.os.name || "Unknown OS"} `;
  return deviceTitle;
};
