import request from "supertest";
import { app } from "../src/settings";
import { StatusCodes } from "http-status-codes";
import { expect, test } from "@jest/globals";
import { refreshTokensBlacklistedCollection, usersCollection } from "../src/db";
import { ObjectId } from "mongodb";

const correctAuthToken = "YWRtaW46cXdlcnR5";
let registeredUserID1: string;
let registeredUserConfirmationCode1: string | null;
let registeredUserAccessToken1: string;
let registeredUserRefreshToken1: string;
let refreshTokenBlacklisted: string;

const userCredentials = {
  login: "Stay",
  email: "nansy@mainModule.org",
  password: "kedrova",
};
const findUserInDB = async (userId: string) => {
  const foundUser = await usersCollection.findOne({
    _id: new ObjectId(userId),
  });
  return foundUser;
};

describe("API for auth", () => {
  beforeAll(async () => {
    await request(app).delete("/api/testing/all-data");
    const createdUser = await request(app)
      .post("/api/users")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .send(userCredentials)
      .expect(StatusCodes.CREATED);
    expect(createdUser.body).toEqual({
      id: expect.any(String),
      login: "Stay",
      email: "nansy@mainModule.org",
      createdAt: expect.any(String),
    });
  });
  test("user can't log in with inappropriate credentials that don't pass validation", async () => {
    const loginCredentials = {
      loginOrEmail: 123,
      password: false,
    };

    const loginResult = await request(app)
      .post("/api/auth/login")
      .send(loginCredentials)
      .expect(StatusCodes.BAD_REQUEST);

    expect(loginResult.body).toEqual({
      errorsMessages: [
        {
          message: "loginOrEmail should be of type String",
          field: "loginOrEmail",
        },
        {
          message: "password should be of type String",
          field: "password",
        },
      ],
    });
  });
  test("user can't log in if any of credentials is missing", async () => {
    const loginCredentials = {
      loginOrEmail: "nansy@mainModule.org",
    };

    const loginResult = await request(app)
      .post("/api/auth/login")
      .send(loginCredentials)
      .expect(StatusCodes.BAD_REQUEST);

    expect(loginResult.body).toEqual({
      errorsMessages: [
        {
          message: "password field is required",
          field: "password",
        },
      ],
    });
  });
  test("user can't log in if user with the given credentials doesn't exist", async () => {
    const loginCredentials = {
      loginOrEmail: "Donald",
      password: "Trump",
    };
    await request(app)
      .post("/api/auth/login")
      .send(loginCredentials)
      .expect(StatusCodes.UNAUTHORIZED);

    const existingUsers = await request(app)
      .get("/api/users")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .expect(StatusCodes.OK);
    await request(app).get("/api/auth/me").expect(StatusCodes.UNAUTHORIZED);
    expect(existingUsers.body.items.length).toEqual(1);
  });
  test("user SHOULD BE REGISTERED", async () => {
    const userCredentials = {
      login: "Nadeen",
      email: "nadeen17122017@gmail.com",
      password: "myDaughter",
    };
    await request(app)
      .post("/api/auth/registration")
      .send(userCredentials)
      .expect(StatusCodes.NO_CONTENT);
    const allUsers = await request(app)
      .get("/api/users")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .expect(StatusCodes.OK);
    expect(allUsers.body.items.length).toEqual(2);
    expect(allUsers.body.items[1].login).toEqual("Nadeen");
    registeredUserID1 = allUsers.body.items[1].id;
    const createdUserInDB = await findUserInDB(registeredUserID1);
    registeredUserConfirmationCode1 =
      createdUserInDB && createdUserInDB?.emailConfirmation.confirmationCode;
    const refreshTokenEmptyArray =
      await refreshTokensBlacklistedCollection.findOne({
        _id: new ObjectId(registeredUserID1),
      });
    expect(refreshTokenEmptyArray?.refreshTokensArray.length).toEqual(0);
  });
  test("user SHOULDN'T be registered if the user with same login already exists", async () => {
    const userCredentials = {
      login: "Nadeen",
      email: "best@gmail.com",
      password: "myDaughter",
    };
    await request(app)
      .post("/api/auth/registration")
      .send(userCredentials)
      .expect(StatusCodes.BAD_REQUEST, {
        errorsMessages: [
          {
            field: "login",
            message: "User with the given login already exists",
          },
        ],
      });
    const allUsers = await request(app)
      .get("/api/users")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .expect(StatusCodes.OK);
    expect(allUsers.body.items.length).toEqual(2);
    expect(allUsers.body.items[0].login).toEqual("Stay");
  });
  test("user SHOULDN'T be registered if the user with same email already exists", async () => {
    const userCredentials = {
      login: "Adam",
      email: "nansy@mainModule.org",
      password: "myDaughter",
    };
    await request(app)
      .post("/api/auth/registration")
      .send(userCredentials)
      .expect(StatusCodes.BAD_REQUEST, {
        errorsMessages: [
          {
            field: "email",
            message: "User with the given email already exists",
          },
        ],
      });
    const allUsers = await request(app)
      .get("/api/users")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .expect(StatusCodes.OK);
    expect(allUsers.body.items.length).toEqual(2);
    expect(allUsers.body.items[0].login).toEqual("Stay");
  });
  test("user CAN'T LOG IN if email was not confirmed", async () => {
    const loginCredentials = {
      loginOrEmail: "Nadeen",
      password: "myDaughter",
    };

    const loginResult = await request(app)
      .post("/api/auth/login")
      .send(loginCredentials)
      .expect(StatusCodes.UNAUTHORIZED);

    expect(loginResult.body).toEqual({});
    expect(loginResult.body).not.toEqual({ accessToken: expect.any(String) });
    const foundUser = await findUserInDB(registeredUserID1);
    expect(foundUser?.emailConfirmation.isConfirmed).toEqual(false);
  });
  test("user CAN'T confirm email if the confirmation code was not provided", async () => {
    const confirmationCode = {
      code: "",
    };

    await request(app)
      .post("/api/auth/registration-confirmation")
      .send(confirmationCode)
      .expect(StatusCodes.BAD_REQUEST, {
        errorsMessages: [
          {
            message: "code must be included in request body",
            field: "code",
          },
        ],
      });
  });
  test("SHOULD NOT RESEND EMAIL if email failed validation", async () => {
    const emailBody = {
      email: "nadeen17122017@gmail",
    };

    await request(app)
      .post("/api/auth/registration-email-resending")
      .send(emailBody)
      .expect(StatusCodes.BAD_REQUEST, {
        errorsMessages: [
          {
            message:
              "Email doesn't match this regular expression: /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/",
            field: "email",
          },
        ],
      });
    const dbUserAfterChange = await findUserInDB(registeredUserID1);

    expect(dbUserAfterChange?.emailConfirmation.isConfirmed).toEqual(false);
    expect(dbUserAfterChange?.emailConfirmation.confirmationCode).toEqual(
      registeredUserConfirmationCode1
    );
  });
  test("user SHOULD be able to RESEND EMAIL", async () => {
    const emailBody = {
      email: "nadeen17122017@gmail.com",
    };

    await request(app)
      .post("/api/auth/registration-email-resending")
      .send(emailBody)
      .expect(StatusCodes.NO_CONTENT);
    const dbUserAfterChange = await findUserInDB(registeredUserID1);

    expect(dbUserAfterChange?.emailConfirmation.isConfirmed).toEqual(false);
    expect(dbUserAfterChange?.emailConfirmation.confirmationCode).not.toEqual(
      registeredUserConfirmationCode1
    );
  });
  test("user SHOULD confirm email with correct confirmation code", async () => {
    const foundUser = await findUserInDB(registeredUserID1);
    registeredUserConfirmationCode1 =
      foundUser && foundUser.emailConfirmation.confirmationCode;
    const confirmationCode = {
      code: registeredUserConfirmationCode1,
    };

    await request(app)
      .post("/api/auth/registration-confirmation")
      .send(confirmationCode)
      .expect(StatusCodes.NO_CONTENT);
    const dbUserConfirmed = await findUserInDB(registeredUserID1);
    expect(dbUserConfirmed?.emailConfirmation.isConfirmed).toEqual(true);
    expect(dbUserConfirmed?.emailConfirmation.confirmationCode).not.toEqual(
      confirmationCode
    );
    expect(dbUserConfirmed?.emailConfirmation.confirmationCode).toEqual(null);
  });
  test("SHOULD throw error when we try to confirm user who was already confirmed", async () => {
    const confirmationCode = {
      code: registeredUserConfirmationCode1,
    };

    await request(app)
      .post("/api/auth/registration-confirmation")
      .send(confirmationCode)
      .expect(StatusCodes.BAD_REQUEST, {
        errorsMessages: [
          {
            field: "code",
            message:
              "Confirmation code is incorrect or user has already been confirmed",
          },
        ],
      });
  });
  test("SHOULD NOT RESEND EMAIL if code was successfully confirmed", async () => {
    const emailBody = {
      email: "nadeen17122017@gmail.com",
    };

    await request(app)
      .post("/api/auth/registration-email-resending")
      .send(emailBody)
      .expect(StatusCodes.BAD_REQUEST, {
        errorsMessages: [
          { field: "email", message: "Email is already confirmed" },
        ],
      });
    const dbUserAfterChange = await findUserInDB(registeredUserID1);

    expect(dbUserAfterChange?.emailConfirmation.isConfirmed).toEqual(true);
    expect(dbUserAfterChange?.emailConfirmation.confirmationCode).toEqual(null);
  });
  test("user SHOULD LOG IN and get ACCESS TOKEN in body and REFRESH TOKEN in cookies", async () => {
    const loginCredentials = {
      loginOrEmail: "Nadeen",
      password: "myDaughter",
    };
    const loggedInResult = await request(app)
      .post("/api/auth/login")
      .send(loginCredentials)
      .expect(StatusCodes.OK);
    registeredUserAccessToken1 = loggedInResult.body.accessToken;
    registeredUserRefreshToken1 = loggedInResult.header["set-cookie"][0]
      .split("=")[1]
      .split(";")[0];
    expect(registeredUserAccessToken1).toEqual(expect.any(String));
    expect(loggedInResult.headers["set-cookie"]).toEqual([expect.any(String)]);
  });
  test("SHOULD get information about current user with login 'Nadeen'", async () => {
    const getCurrentUserInfoResult = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${registeredUserAccessToken1}`)
      .expect(StatusCodes.OK);
    expect(getCurrentUserInfoResult.body).toMatchObject({
      login: "Nadeen",
      email: "nadeen17122017@gmail.com",
      userId: expect.any(String),
    });
  });
  test("SHOULD NOT get information about current user after 12 seconds cos' access token will be expired", async () => {
    jest.useFakeTimers();
    jest.advanceTimersByTime(12000);
    const getCurrentUserInfoResult = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${registeredUserAccessToken1}`)
      .expect(StatusCodes.UNAUTHORIZED);
    expect(getCurrentUserInfoResult.body).toEqual({});
    jest.useRealTimers();
  });
  test("user SHOULD NOT be able to update REFRESH-ACCESS TOKEN pair, if refresh token is not provided in cookies", async () => {
    await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", ["refreshToken=''"])
      .expect(StatusCodes.UNAUTHORIZED);
    const refreshTokensBlacklist =
      await refreshTokensBlacklistedCollection.findOne({
        _id: new ObjectId(registeredUserID1),
      });
    expect(refreshTokensBlacklist?.refreshTokensArray.length).toEqual(0);
  });
  test("user SHOULD BE able to update REFRESH-ACCESS TOKEN pair", async () => {
    const result = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refreshToken=${registeredUserRefreshToken1}`])
      .expect(StatusCodes.OK);
    const refreshTokensBlacklist =
      await refreshTokensBlacklistedCollection.findOne({
        _id: new ObjectId(registeredUserID1),
      });
    expect(refreshTokensBlacklist?.refreshTokensArray.length).toEqual(1);
    expect(refreshTokensBlacklist?.refreshTokensArray[0]).toEqual(
      registeredUserRefreshToken1
    );
    expect(
      result.headers["set-cookie"][0].split("=")[1].split(";")[0]
    ).not.toEqual(registeredUserRefreshToken1);
    expect(result.body.accessToken).not.toEqual(registeredUserAccessToken1);
  });
  test("user SHOULD NOT BE able to update REFRESH-ACCESS TOKEN pair if refresh token is blacklisted", async () => {
    const result = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refreshToken=${registeredUserRefreshToken1}`])
      .expect(StatusCodes.UNAUTHORIZED);
    const refreshTokensBlacklist =
      await refreshTokensBlacklistedCollection.findOne({
        _id: new ObjectId(registeredUserID1),
      });
    expect(refreshTokensBlacklist?.refreshTokensArray.length).toEqual(1);
    expect(refreshTokensBlacklist?.refreshTokensArray[0]).toEqual(
      registeredUserRefreshToken1
    );
    expect(result.body).toEqual({});
  });
  // it("user SHOULD NOT be able to update REFRESH-ACCESS TOKEN pair, if refresh token is expired", async () => {
  //   jest.useFakeTimers();
  //   jest.advanceTimersByTime(12000);
  //   await request(app)
  //     .post("/api/auth/refresh-token")
  //     .set("Cookie", [`refreshToken=${registeredUserRefreshToken1}`])
  //     .expect(StatusCodes.UNAUTHORIZED);
  //   const refreshTokensBlacklist =
  //     await refreshTokensBlacklistedCollection.findOne({
  //       _id: new ObjectId(registeredUserID1),
  //     });
  //   expect(refreshTokensBlacklist?.refreshTokensArray.length).toEqual(0);
  //   jest.useRealTimers();
  // });

  // test("user SHOULD NOT be able to renew refresh-access-token pair with blacklisted refresh token", async () => {
  //   const userLogin = {
  //     loginOrEmail: "Stay",
  //     password: "kedrova",
  //   };
  //   const loginResult = await request(app)
  //     .post("/api/auth/login")
  //     .send(userLogin)
  //     .expect(StatusCodes.OK);
  //   const refreshToken = loginResult.headers["set-cookie"];

  //   await request(app)
  //     .post("/api/auth/refresh-token")
  //     .set("Cookie", refreshToken)
  //     .expect(StatusCodes.OK);

  //   await request(app)
  //     .post("/api/auth/refresh-token")
  //     .set("Cookie", refreshToken)
  //     .expect(StatusCodes.UNAUTHORIZED);
  // });
});
