import { TVideo } from "./../src/dto/data.types";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../src/settings";

describe("videos router", () => {
  beforeAll(async () => {
    await request(app).delete("/api/testing/all-data");
  });

  test("should return 200 status and list of videos", async () => {
    await request(app).get("/api/videos").expect(200, []);
  });

  test("should return 400 if body was not provided and the course shouldn't be created", async () => {
    await request(app)
      .post("/api/videos")
      .send({ title: "     " })
      .expect(StatusCodes.BAD_REQUEST);

    const getAllExistingCourses = await request(app)
      .get("/api/videos")
      .expect(StatusCodes.OK);
    expect(getAllExistingCourses).not.toContainEqual({
      id: expect.any(String),
      title: "",
    });
  });

  let createdCourse1: CourseViewModel | null = null;
  test("should return status code 201 and newly created course", async () => {
    const createResponse = await request(app)
      .post("/courses")
      .send({ title: "Taniusha is a great girl" })
      .expect(StatusCodes.CREATED)
      .expect("Content-Type", "application/json; charset=utf-8");
    createdCourse1 = createResponse.body;
    expect(createdCourse1).toEqual({
      id: expect.any(String),
      title: "Taniusha is a great girl",
    });

    await request(app).get("/courses").expect(StatusCodes.OK, [createdCourse1]);
  });

  let createdCourse2: CourseViewModel | null = null;
  test(`create one more course course with ${StatusCodes.CREATED}`, async () => {
    const postResponse = await request(app)
      .post("/courses")
      .send({ title: "Time is everything, not just money" })
      .expect(StatusCodes.CREATED)
      .expect("Content-Type", "application/json; charset=utf-8");
    createdCourse2 = postResponse.body;

    expect(createdCourse2).toEqual({
      id: expect.any(String),
      title: "Time is everything, not just money",
    });

    await request(app)
      .get("/courses")
      .expect(StatusCodes.OK, [createdCourse1, createdCourse2]);
  });

  test("should return 404 for not existing video", async () => {
    await request(app).get("/api/videos/999").expect(StatusCodes.NOT_FOUND);
  });

  test.only("should return 200 for existing video", async () => {
    await request(app).get("/api/videos/1").expect(StatusCodes.OK);
  });

  let createdVideo: TVideo;
  test("should delete the particular video", async () => {
    await request(app)
      .delete("/api/videos/" + createdVideo.id)
      .expect(StatusCodes.NO_CONTENT);
    await request(app)
      .get("/api/videos/" + createdVideo.id)
      .expect(StatusCodes.NOT_FOUND);
  });
});

// describe("/videos", () => {
//   let newVideo: VideoType | null = null;

//   beforeAll(async () => {
//     await request(app).delete("/testing/all-data").expect(204);
//   });

//   it("GET products = []", async () => {
//     await request(app).get("/videos/").expect([]);
//   });

//   it("- POST does not create the video with incorrect data (no title, no author)", async function () {
//     await request(app)
//       .post("/videos/")
//       .send({ title: "", author: "" })
//       .expect(CodeResponsesEnum.Incorrect_values_400, {
//         errorsMessages: [
//           { message: "title is required", field: "title" },
//           { message: "author is required", field: "author" },
//         ],
//       });

//     const res = await request(app).get("/videos/");
//     expect(res.body).toEqual([]);
//   });

//   it("- GET product by ID with incorrect id", async () => {
//     await request(app).get("/videos/helloWorld").expect(400);
//   });
//   it("+ GET product by ID with correct id", async () => {
//     await request(app)
//       .get("/videos/" + newVideo!.id)
//       .expect(200, newVideo);
//   });

//   it("- PUT product by ID with incorrect data", async () => {
//     await request(app)
//       .put("/videos/" + 1223)
//       .send({ title: "title", author: "title" })
//       .expect(CodeResponsesEnum.Not_found_404);

//     const res = await request(app).get("/videos/");
//     expect(res.body[0]).toEqual(newVideo);
//   });

//   it("+ PUT product by ID with correct data", async () => {
//     await request(app)
//       .put("/videos/" + newVideo!.id)
//       .send({
//         title: "hello title",
//         author: "hello author",
//         publicationDate: "2023-01-12T08:12:39.261Z",
//       })
//       .expect(CodeResponsesEnum.Not_content_204);

//     const res = await request(app).get("/videos/");
//     expect(res.body[0]).toEqual({
//       ...newVideo,
//       title: "hello title",
//       author: "hello author",
//       publicationDate: "2023-01-12T08:12:39.261Z",
//     });
//     newVideo = res.body[0];
//   });

//   it("- DELETE product by incorrect ID", async () => {
//     await request(app)
//       .delete("/videos/876328")
//       .expect(CodeResponsesEnum.Not_found_404);

//     const res = await request(app).get("/videos/");
//     expect(res.body[0]).toEqual(newVideo);
//   });
//   it("+ DELETE product by correct ID, auth", async () => {
//     await request(app)
//       .delete("/videos/" + newVideo!.id)
//       .set("authorization", "Basic YWRtaW46cXdlcnR5")
//       .expect();

//     const res = await request(app).get("/videos/");
//     expect(res.body.length).toBe(0);
//   });
// });
