import request from "supertest";
import { app } from "../src/settings";
import { StatusCodes } from "http-status-codes";

const correctAuthToken = "YWRtaW46cXdlcnR5";
const incorrectAuthToken = "YWRtaW46c864XdlcnR5=5";
describe("API for auth", () => {
  beforeAll(async () => {
    await request(app).delete("/api/testing/all-data");
  });
  test("User SHOULDN'T be logged in to the system", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({ loginOrEmail: "Dima", password: "13121110A" })
      .expect(StatusCodes.UNAUTHORIZED);
  });
  test("User SHOULD be created", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .send({
        login: "Nansy",
        password: "NansyIsTheBest",
        email: "nansy@mainModule.org",
      })
      .expect(StatusCodes.CREATED);
    expect(response.body.login).toEqual("Nansy");
    expect(response.body.email).toBe("nansy@mainModule.org");
  });
  test("User SHOULDN'T be logged in to the system", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({ loginOrEmail: "Dima", password: "13121110A" })
      .expect(StatusCodes.UNAUTHORIZED);
  });
});
