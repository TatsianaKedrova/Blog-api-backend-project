import request from "supertest";
import { app } from "../src/settings";
import { StatusCodes } from "http-status-codes";

describe("API for blogs", () => {
  beforeAll(async () => {
    await request(app).delete("/api/testing/all-data");
  });
  test("GET list of blogs with status 200", async () => {
    await request(app).get("/api/blogs").expect(StatusCodes.OK, []);
  });

  test("CREATE new blog and return status 201", () => {}, 1000);

  test("GET blog ID with 200 status", async () => {
    await request(app).get("/api/blogs/1277").expect(StatusCodes.NOT_FOUND);
    const getResponse = (await request(app).get("/api/blogs")).body;
    expect(getResponse.length).toEqual(0);
    expect(getResponse).toEqual([]);
  });

  test("WRONG Id should give 404 status", async () => {
    await request(app).get("/api/blogs/1277").expect(StatusCodes.NOT_FOUND);
    const getResponse = (await request(app).get("/api/blogs")).body;
    expect(getResponse.length).toEqual(0);
    expect(getResponse).toEqual([]);
  });
});
