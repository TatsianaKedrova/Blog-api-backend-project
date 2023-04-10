import request from "supertest";
import { app } from "../src/settings";
import { StatusCodes } from "http-status-codes";
import { PostViewModel } from "../src/dto/postsDTO/PostViewModel";
import { BlogViewModel } from "../src/dto/blogsDTO/BlogViewModel";

const correctAuthToken = "YWRtaW46cXdlcnR5";
const incorrectAuthToken = "YWRtaW46c864XdlcnR5=5";

const blogData: BlogViewModel = {
  id: "12345",
  name: "Blog1",
  description: "Blog1 ",
  websiteUrl: "https://ghYYYhkhkhkdld79.yuuecvmjxm",
};

describe("API for posts", () => {
  beforeAll(async () => {
    await request(app).delete("/api/testing/all-data");
  });
  test("GET list of posts with status 200", async () => {
    await request(app).get("/api/posts").expect(StatusCodes.OK, []);
  });

  test("SHOULD NOT create a new post with incorrect input data and return status 400", async () => {
    await request(app)
      .post("/api/posts")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .send({})
      .expect(StatusCodes.BAD_REQUEST, {
        errorsMessages: [
          {
            message: "title field is required",
            field: "title",
          },
          {
            message: "shortDescription field is required",
            field: "shortDescription",
          },
          {
            message: "content field is required",
            field: "content",
          },
          {
            message: "blogId with this value doesn't exist",
            field: "blogId",
          },
        ],
      });

    const getAllExistingCourses = await request(app)
      .get("/api/posts")
      .expect(StatusCodes.OK);
    expect(getAllExistingCourses.body).toEqual([]);
  });

  test("SHOULD NOT create a new post with incorrect AUTH TYPE and return status 401", async () => {
    await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${correctAuthToken}`)
      .send({})
      .expect(StatusCodes.UNAUTHORIZED, {});

    const getAllExistingCourses = await request(app)
      .get("/api/posts")
      .expect(StatusCodes.OK);
    expect(getAllExistingCourses.body).toEqual([]);
  });

  test("SHOULD NOT create a new post with incorrect Auth token and return status 401", async () => {
    await request(app)
      .post("/api/posts")
      .set("Authorization", `Basic ${incorrectAuthToken}`)
      .send({})
      .expect(StatusCodes.UNAUTHORIZED, {});

    const getAllExistingCourses = await request(app)
      .get("/api/posts")
      .expect(StatusCodes.OK);
    expect(getAllExistingCourses.body).toEqual([]);
  });

  let createdPost1: PostViewModel;
  let createdPost2: PostViewModel;
  test.only("Create a new post with correct input data and return status 201", async () => {
    let data = {
      title: "Tatiana",
      shortDescription: "Who run the world",
      content: "ggggggggggggggggggggggggggggggg",
      blogId: blogData.id,
    };
    const postResponse = await request(app)
      .post("/api/posts")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .send(data)
      .expect(StatusCodes.CREATED);
    createdPost1 = postResponse.body;
    console.log(createdPost1);
    expect(postResponse.body.content).toEqual("ggggggggggggggggggggggggggggggg");

    const getAllExistingCourses = await request(app)
      .get("/api/blogs")
      .expect(StatusCodes.OK);

    expect(getAllExistingCourses.body.length).toEqual(1);
  });
  test("Create a new blog with incorrect input name and return status 400", async () => {
    const postResponse = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .send({
        name: "",
        description: "koala is about blog 1. That's it",
        websiteUrl:
          "https://MbkyQDhuICIaHnYLc7ws51KEn5wrp7cYHuVZEHlP9ADc3.uZDiBjA8F",
      })
      .expect(StatusCodes.BAD_REQUEST, {
        errorsMessages: [
          {
            message: "name must be included in request body",
            field: "name",
          },
        ],
      });
    expect(postResponse.body.name).toBeUndefined();

    const getAllExistingCourses = await request(app)
      .get("/api/blogs")
      .expect(StatusCodes.OK);

    expect(getAllExistingCourses.body.length).toEqual(1);
  });

  test("Create a new blog with incorrect input website and description and return status 400", async () => {
    const postResponse = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .send({
        name: "Nadine",
        description: null,
        websiteUrl:
          "http://MbkyQDhuICIaHnYLc7ws51KEn5wrp7cYHuVZEHlP9ADc3.uZDiBjA8F",
      })
      .expect(StatusCodes.BAD_REQUEST, {
        errorsMessages: [
          {
            message: "description should be of type String",
            field: "description",
          },
          {
            message: "Url is incorrect",
            field: "websiteUrl",
          },
        ],
      });
    const getAllExistingCourses = await request(app)
      .get("/api/blogs")
      .expect(StatusCodes.OK);

    expect(getAllExistingCourses.body.length).toEqual(1);
  });

  test("GET blog ID with 404 status", async () => {
    await request(app).get("/api/blogs/125").expect(StatusCodes.NOT_FOUND);
  });

  test("GET blog ID with 200 status", async () => {
    await request(app)
      .get(`/api/blogs/${createdPost1.id}`)
      .expect(StatusCodes.OK);
  });

  test("Create second new blog with correct input data and return status 201", async () => {
    const postResponse = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .send({
        name: "Nadine",
        description: "Cats can cure - CCC",
        websiteUrl: "https://HnYLc7ws51KEn5wrp7cYHuVZEHlP9ADc3.uZDiBjA8F",
      })
      .expect(StatusCodes.CREATED);
    createdPost2 = postResponse.body;
    console.log(createdPost2);
    expect(postResponse.body.description).toEqual("Cats can cure - CCC");

    const getAllExistingCourses = await request(app)
      .get("/api/blogs")
      .expect(StatusCodes.OK);

    expect(getAllExistingCourses.body.length).toEqual(2);
  });

  test("Should return Unauthorized status 401 cos' auth token is incorrect", async () => {
    await request(app)
      .delete(`/api/blogs/${createdPost2.id}`)
      .set("Authorization", `Basic ${incorrectAuthToken}`)
      .expect(StatusCodes.UNAUTHORIZED);
    const getResponse = (await request(app).get("/api/blogs")).body;
    expect(getResponse.length).toEqual(2);
    expect(getResponse[1].name).toEqual("Nadine");
  });

  test("Should return NOT_FOUND status 404 with incorrect ID", async () => {
    await request(app)
      .delete("/api/blogs/123")
      .set("Authorization", `Basic ${correctAuthToken}`)
      .expect(StatusCodes.NOT_FOUND);
    const getResponse = (await request(app).get("/api/blogs")).body;
    expect(getResponse.length).toEqual(2);
    expect(getResponse[1].name).toEqual("Nadine");
  });

  test("Should delete blog by ID with correct ID", async () => {
    await request(app)
      .delete(`/api/blogs/${createdPost2.id}`)
      .set("Authorization", `Basic ${correctAuthToken}`)
      .expect(StatusCodes.NO_CONTENT);
    const getResponse = (await request(app).get("/api/blogs")).body;
    expect(getResponse[0].name).toEqual("fff");
    expect(getResponse.length).toBe(1);
  });

  test("Should update name and description with status 204", async () => {
    const postResponse = await request(app)
      .put(`/api/blogs/${createdPost1.id}`)
      .set("Authorization", `Basic ${correctAuthToken}`)
      .send({
        name: "Tania",
        description: "Dog don't drive - DDD",
        websiteUrl: "https://HnYLc7ws51KEn5wrp7cYHuVZEHlP9ADc3.uZDiBjA8F",
      })
      .expect(StatusCodes.NO_CONTENT);
    expect(postResponse.body).toEqual({});

    const getAllExistingCourses = await request(app)
      .get("/api/blogs")
      .expect(StatusCodes.OK);

    expect(getAllExistingCourses.body[0].name).toEqual("Tania");
    expect(getAllExistingCourses.body[0].description).toEqual(
      "Dog don't drive - DDD"
    );
  });

  test("Shouldn't update blog with incorrect Auth Type -  status 401", async () => {
    const postResponse = await request(app)
      .put(`/api/blogs/${createdPost1.id}`)
      .set("Authorization", `Bearer ${correctAuthToken}`)
      .send({
        name: "Stasty",
        description: "Stasty sits straight - SSS",
        websiteUrl: "https://HnYLc7ws51KEn5wrp7cYHuVZEHlP9ADc3.uZDiBjA8F",
      })
      .expect(StatusCodes.UNAUTHORIZED);
    expect(postResponse.body).toEqual({});

    const getAllExistingCourses = await request(app)
      .get("/api/blogs")
      .expect(StatusCodes.OK);

    expect(getAllExistingCourses.body[0].name).toEqual("Tania");
    expect(getAllExistingCourses.body[0].description).toEqual(
      "Dog don't drive - DDD"
    );
  });

  test("Shouldn't update blog with incorrect Auth Value -  status 401", async () => {
    const postResponse = await request(app)
      .put(`/api/blogs/${createdPost1.id}`)
      .set("Authorization", `Basic ${incorrectAuthToken}`)
      .send({
        name: "Stasty",
        description: "Stasty sits straight - SSS",
        websiteUrl: "https://HnYLc7ws51KEn5wrp7cYHuVZEHlP9ADc3.uZDiBjA8F",
      })
      .expect(StatusCodes.UNAUTHORIZED);
    expect(postResponse.body).toEqual({});

    const getAllExistingCourses = await request(app)
      .get("/api/blogs")
      .expect(StatusCodes.OK);

    expect(getAllExistingCourses.body[0].name).toEqual("Tania");
    expect(getAllExistingCourses.body[0].description).toEqual(
      "Dog don't drive - DDD"
    );
  });

  test("Shouldn't update blog with missing value `description` and `websiteUrl` -  status 400", async () => {
    await request(app)
      .put(`/api/blogs/${createdPost1.id}`)
      .set("Authorization", `Basic ${correctAuthToken}`)
      .send({
        name: "Stasty",
      })
      .expect(StatusCodes.BAD_REQUEST, {
        errorsMessages: [
          {
            message: "description field is required",
            field: "description",
          },
          {
            message: "websiteUrl field is required",
            field: "websiteUrl",
          },
        ],
      });

    const getAllExistingCourses = await request(app)
      .get("/api/blogs")
      .expect(StatusCodes.OK);

    expect(getAllExistingCourses.body[0].name).toEqual("Tania");
    expect(getAllExistingCourses.body[0].description).toEqual(
      "Dog don't drive - DDD"
    );
  });

  test("Shouldn't update blog with incorrect input values -  status 400", async () => {
    await request(app)
      .put(`/api/blogs/${createdPost1.id}`)
      .set("Authorization", `Basic ${correctAuthToken}`)
      .send({
        name: 0,
        description: "",
        websiteUrl: "http://HnYLc7ws51KEn5wrp7cYHuVZEHlP9ADc3.uZDiBjA8F",
      })
      .expect(StatusCodes.BAD_REQUEST, {
        errorsMessages: [
          {
            message: "name should be of type String",
            field: "name",
          },
          {
            message: "description must be included in request body",
            field: "description",
          },
          {
            message: "Url is incorrect",
            field: "websiteUrl",
          },
        ],
      });

    const getAllExistingCourses = await request(app)
      .get("/api/blogs")
      .expect(StatusCodes.OK);

    expect(getAllExistingCourses.body[0].name).toEqual("Tania");
    expect(getAllExistingCourses.body[0].description).toEqual(
      "Dog don't drive - DDD"
    );
  });
});
