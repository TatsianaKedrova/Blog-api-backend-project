import request from "supertest";
import { app } from "../src/settings";
import { StatusCodes } from "http-status-codes";
import { beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import { UserInputModel } from "./dto/usersDTO/usersDTO";
import { securityDevicesCollection } from "../src/db";
import { getJwtPayloadResult } from "./globals/jwt-service";
import { UsersQueryRepository } from "./repositories/query-repository/usersQueryRepository";
const usersQueryRepository = new UsersQueryRepository();
const userAgents = {
  chromeWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  safariIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://google.com)",
  chromeMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
};
let user1Payload: UserInputModel;
let user2Payload: UserInputModel;

//delay timer
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Security Devices E2E tests", () => {
  beforeAll(async () => {
    await request(app).delete("/api/testing/all-data");
    //Create User 1
    user1Payload = {
      login: "baletro",
      email: "baletro@example.com",
      password: "rtrttrtrtr",
    };
    const registrationResponse = await request(app)
      .post("/api/auth/registration")
      .send(user1Payload);
    expect(registrationResponse.status).toBe(204);
    const registeredUser = await usersQueryRepository.findUserByEmail(
      user1Payload.email,
    );
    const confirmationCode = registeredUser?.emailConfirmation.confirmationCode;
    const confirmationResponse = await request(app)
      .post("/api/auth/registration-confirmation")
      .send({ code: confirmationCode });

    expect(confirmationResponse.status).toBe(204);

    //Create User 2
    user2Payload = {
      login: "userone",
      email: "userone@example.com",
      password: "password123!",
    };
    await request(app)
      .post("/api/auth/registration")
      .send(user2Payload)
      .expect(StatusCodes.NO_CONTENT);
    const registeredUser2 = await usersQueryRepository.findUserByEmail(
      user2Payload.email,
    );
    const confirmationCode2 =
      registeredUser2?.emailConfirmation.confirmationCode;
    const confirmationResponse2 = await request(app)
      .post("/api/auth/registration-confirmation")
      .send({ code: confirmationCode2 });

    expect(confirmationResponse2.status).toBe(204);
  });

  beforeEach(async () => {
    await securityDevicesCollection.deleteMany({});
  });
  //Create common User-Agent for these 2 users
  const commonUserAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

  test("should return 401 Unauthorized if no refresh token is provided in cookies", async () => {
    const response = await request(app).get("/api/security/devices");
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
  test("should return 200 Success if correct refresh token is provided in cookies", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      loginOrEmail: "baletro",
      password: "rtrttrtrtr",
    });
    const cookies = loginResponse.headers["set-cookie"];

    // 3. Pass the cookies directly to the secure route
    const sessionsResponse = await request(app)
      .get("/api/security/devices")
      .set("Cookie", cookies); // Pass the entire array straight through

    expect(sessionsResponse.status).toBe(200);
  });
  test("DELETE -> /security/devices/:sessionId should return 400 Bad Request when User attempts to delete current active session", async () => {
    // 2. Login User 2 to establish their device session
    const loginUser2 = await request(app)
      .post("/api/auth/login")
      .set("User-Agent", commonUserAgent)
      .send({
        loginOrEmail: user2Payload.login,
        password: user2Payload.password,
      })
      .expect(StatusCodes.OK);
    const user2Cookie = loginUser2.headers["set-cookie"];
    expect(user2Cookie).toBeDefined();
    const devicesUser2 = await request(app)
      .get("/api/security/devices")
      .set("Cookie", user2Cookie)
      .expect(StatusCodes.OK);

    // Grab the first active device session ID belonging to User 1
    expect(devicesUser2.body.length).toBeGreaterThan(0);
    const currentDeviceSession = devicesUser2.body[0].deviceId;

    await request(app)
      .delete(`/api/security/devices/${currentDeviceSession}`)
      .set("Cookie", user2Cookie)
      .expect(StatusCodes.BAD_REQUEST);
  });
  test(`GET -> "/security/devices": login user 4 times from different browsers. Then get the list of devices`, async () => {
    //to not have 429 error
    await delay(10000);
    //First device sessinon
    const loginUser1ChromeWindows = await request(app)
      .post("/api/auth/login")
      .set("User-Agent", userAgents.chromeWindows)
      .send({
        loginOrEmail: user2Payload.login,
        password: user2Payload.password,
      })
      .expect(StatusCodes.OK);
    const chromeWindowsCookie = loginUser1ChromeWindows.headers["set-cookie"];
    const firstCookieString = chromeWindowsCookie ? chromeWindowsCookie[0] : "";
    const refreshToken = firstCookieString.split(";")[0].split("=")[1];

    // 2. Decode the token payload using your app secret
    const payload = getJwtPayloadResult(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    );

    // 3. Extract your generated deviceId
    const chromeWindowsDeviceId = payload?.deviceId;
    expect(chromeWindowsCookie).toBeDefined();
    //Second device session
    const loginUser1ChromeMac = await request(app)
      .post("/api/auth/login")
      .set("User-Agent", userAgents.chromeMac)
      .send({
        loginOrEmail: user2Payload.login,
        password: user2Payload.password,
      })
      .expect(StatusCodes.OK);
    const chromeMacCookie = loginUser1ChromeMac.headers["set-cookie"];
    expect(chromeMacCookie).toBeDefined();

    //Third device session
    const loginUser1Googlebot = await request(app)
      .post("/api/auth/login")
      .set("User-Agent", userAgents.googlebot)
      .send({
        loginOrEmail: user2Payload.login,
        password: user2Payload.password,
      })
      .expect(StatusCodes.OK);
    const googlebotCookie = loginUser1Googlebot.headers["set-cookie"];
    expect(googlebotCookie).toBeDefined();

    //Forth device session
    const loginUser1SafariIphone = await request(app)
      .post("/api/auth/login")
      .set("User-Agent", userAgents.safariIphone)
      .send({
        loginOrEmail: user2Payload.login,
        password: user2Payload.password,
      })
      .expect(StatusCodes.OK);
    const safariIphoneCookie = loginUser1SafariIphone.headers["set-cookie"];
    expect(safariIphoneCookie).toBeDefined();

    const allUserSessions = await request(app)
      .get("/api/security/devices")
      .set("Cookie", safariIphoneCookie)
      .expect(StatusCodes.OK)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(4);
      });
    console.log("all user sessions: ", allUserSessions);
    expect(allUserSessions.body[0].deviceId).toEqual(chromeWindowsDeviceId);
    await request(app)
      .delete(`/api/security/devices/${allUserSessions.body[2].deviceId}`)
      .set("Cookie", safariIphoneCookie)
      .expect(StatusCodes.NO_CONTENT);
    await request(app)
      .get("/api/security/devices")
      .set("Cookie", safariIphoneCookie)
      .expect(StatusCodes.OK)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(3);
      });
  });
});
