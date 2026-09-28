import request from "supertest";
import { app } from "../src/settings";
import { StatusCodes } from "http-status-codes";
import { beforeAll, describe, expect, test } from "@jest/globals";
import { usersQueryRepository } from "../src/repositories/query-repository/usersQueryRepository";

const userAgents = {
  chromeWindows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  safariIphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://google.com)",
  chromeMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
};
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

describe("Security Devices E2E tests", () => {
  beforeAll(async () => {
    await request(app).delete("/api/testing/all-data");
    const userPayload = {
      login: "baletro",
      email: "baletro@example.com",
      password: "rtrttrtrtr",
    };
    const registrationResponse = await request(app)
      .post("/api/auth/registration")
      .send(userPayload);
    expect(registrationResponse.status).toBe(204);
    const registeredUser = await usersQueryRepository.findUserByEmail(
      userPayload.email,
    );
    const confirmationCode = registeredUser?.emailConfirmation.confirmationCode;
    const confirmationResponse = await request(app)
      .post("/api/auth/registration-confirmation")
      .send({ code: confirmationCode });

    expect(confirmationResponse.status).toBe(204);
  });
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
    //Create User 2
    const user2Payload = {
      login: "userone",
      email: "userone@example.com",
      password: "password123!",
    };
    await request(app)
      .post("/api/auth/registration")
      .send(user2Payload)
      .expect(StatusCodes.NO_CONTENT);
    const registeredUser = await usersQueryRepository.findUserByEmail(
      user2Payload.email,
    );
    const confirmationCode = registeredUser?.emailConfirmation.confirmationCode;
    const confirmationResponse = await request(app)
      .post("/api/auth/registration-confirmation")
      .send({ code: confirmationCode });

    expect(confirmationResponse.status).toBe(204);
    // 2. Login User 2 to establish their device session
    const loginUser2 = await request(app)
      .post("/api/auth/login")
      .set("User-Agent", commonUserAgent)
      .send({
        loginOrEmail: user2Payload.login,
        password: user2Payload.password,
      })
      .expect(StatusCodes.OK);
    console.log("login user 2: ", JSON.stringify(loginUser2.body, null, 2));
    const user2Cookie = loginUser2.headers["set-cookie"];
    expect(user2Cookie).toBeDefined();
    const devicesUser2 = await request(app)
      .get("/api/security/devices")
      .set("Cookie", user2Cookie)
      .expect(StatusCodes.OK);

    // Grab the first active device session ID belonging to User 1
    expect(devicesUser2.body.length).toBeGreaterThan(0);
    const currentDeviceSession = devicesUser2.body[0].deviceId
    
    await request(app)
      .delete(`/api/security/devices/${currentDeviceSession}`)
      .set("Cookie", user2Cookie)
      .expect(StatusCodes.BAD_REQUEST);

    // // 4. Create User 2
    // const user2Input = {
    //   login: "usertwo",
    //   email: "usertwo@example.com",
    //   password: "password456!",
    // };
    // await request(app)
    //   .post("/users")
    //   .send(user2Input)
    //   .expect(StatusCodes.CREATED);

    // // 5. Login User 2 with the EXACT SAME User-Agent header string as User 1
    // const loginRes2 = await request(app)
    //   .post("/auth/login")
    //   .set("User-Agent", commonUserAgent)
    //   .send({ loginOrEmail: user2Input.login, password: user2Input.password })
    //   .expect(StatusCodes.OK);

    // const user2Cookies = loginRes2.headers["set-cookie"];

    // // 6. Action: Attempt to delete User 1's session ID while authenticated as User 2
    // const deleteResponse = await request(app)
    //   .delete(`/security/devices/${user1SessionId}`)
    //   .set("Cookie", user2Cookies);

    // // 7. Assertion: Ensure the server blocks the request with a 403 Forbidden status code
    // expect(deleteResponse.status).toBe(StatusCodes.FORBIDDEN);

    // // 8. Optional verification: Ensure User 1's session document was NOT actually removed from the database
    // const sessionStillExists = await securityDevicesCollection.findOne({
    //   deviceId: user1SessionId,
    // });
    // expect(sessionStillExists).not.toBeNull();
  });
  // describe("Rate Limiting Integration Test", () => {
  //   it("should allow up to 5 requests but return 429 Too Many Requests on the 6th attempt", async () => {
  //     const endpoint = "/api/security/devices";

  //     // Fire 5 rapid, concurrent or sequential requests (all should bypass the limit)
  //     for (let i = 0; i < 5; i++) {
  //       const res = await request(app)
  //         .get(endpoint)
  //         .set("Cookie", ["refreshToken=mock-token"]);

  //       // They can be 200 or 401 depending on auth status, but they should NOT be 429
  //       expect(res.status).not.toBe(StatusCodes.TOO_MANY_REQUESTS);
  //     }

  //     // Fire the 6th immediate request to break the window constraint
  //     const sixthResponse = await request(app)
  //       .get(endpoint)
  //       .set("Cookie", ["refreshToken=mock-token"]);

  //     // Assert your custom rate limiter middleware blocks this interaction securely!
  //     expect(sixthResponse.status).toBe(StatusCodes.TOO_MANY_REQUESTS);
  //     expect(sixthResponse.body.message).toContain(
  //       "Api calls exceeded the rate limit",
  //     );
  //   });
});
