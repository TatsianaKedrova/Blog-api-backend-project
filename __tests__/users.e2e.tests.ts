import request from "supertest";
import { app } from "../src/settings";
import { StatusCodes } from "http-status-codes";

const correctAuthToken = "YWRtaW46cXdlcnR5";
const incorrectAuthToken = "YWRtaW46c864XdlcnR5=5";

describe("API for users", () => {
  // beforeAll(async () => {
  //   await request(app).delete("/api/testing/all-data");
  // });
  // test("GET list of blogs with status 200", async () => {
  //   await request(app).get("/api/blogs").expect(StatusCodes.OK, []);
  // });
});
