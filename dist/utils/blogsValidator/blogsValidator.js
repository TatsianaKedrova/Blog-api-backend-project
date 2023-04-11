"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsValidator = exports.blogsURLValidator = void 0;
const postsValidator_1 = require("./../postsValidator/postsValidator");
const blogsURLValidator = () => {
    return (0, postsValidator_1.stringsInputValidator)("websiteUrl", 100).custom((url) => {
        const urlRegex = new RegExp("^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
        const testUrl = urlRegex.test(url);
        if (testUrl) {
            return true;
        }
        else
            throw new Error("Url is incorrect");
    });
};
exports.blogsURLValidator = blogsURLValidator;
exports.blogsValidator = [
    (0, postsValidator_1.stringsInputValidator)("name", 15),
    (0, postsValidator_1.stringsInputValidator)("description", 500),
    (0, exports.blogsURLValidator)(),
];
//# sourceMappingURL=blogsValidator.js.map