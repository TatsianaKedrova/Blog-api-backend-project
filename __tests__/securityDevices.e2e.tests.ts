import request from "supertest";
import { app } from "../src/settings";
import { StatusCodes } from "http-status-codes";
import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import { ObjectId } from "mongodb";

import { securityDevicesCollection, usersCollection } from "./db";

let testUserId: string;
let primaryUserCookie: string;
let alternateUserCookie: string;

//Modern Desktop Browser (Windows / Chrome)
let currentUser =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
//Mobile Device (iPhone / Safari)
let userAgent2 =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
//Legitimate Web Crawler (Googlebot)
let userAgent3 = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://google.com)";
//desktop User-Agent for Google Chrome on macOS
let userAgent4 =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const user1 = {
  login: "Stay",
  email: "nansy@mainModule.org",
  password: "kedrova",
};

const user2 = {
  login: "Rose",
  email: "rose@mainModule.org",
  password: "kedrova",
};

beforeAll(async () => {
  await request(app).delete("/api/testing/all-data");
});
