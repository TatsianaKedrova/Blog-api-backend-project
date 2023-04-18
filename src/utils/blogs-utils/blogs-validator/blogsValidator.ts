import { stringsInputValidator } from "../../posts-validator/postsValidator";

export const blogsURLValidator = () => {
  return stringsInputValidator("websiteUrl", 100).custom((url) => {
    const urlRegex = new RegExp(
      "^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$"
    );
    const testUrl = urlRegex.test(url);
    if (testUrl) {
      return true;
    } else throw new Error("Url is incorrect");
  });
};

export const blogsValidator = [
  stringsInputValidator("name", 15),
  stringsInputValidator("description", 500),
  blogsURLValidator(),
];
