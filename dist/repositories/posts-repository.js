"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = exports.postsList = void 0;
const crypto_1 = require("crypto");
const project_db_1 = require("../temporal-database/project-db");
exports.postsList = project_db_1.db.posts;
exports.postsRepository = {
    getListOfPosts() {
        return exports.postsList;
    },
    findPostById(id) {
        const foundPostById = project_db_1.db.posts.find((element) => element.id === id);
        return foundPostById;
    },
    createNewPost(body) {
        const { title, shortDescription, content, blogId } = body;
        const blogNameValue = project_db_1.db.blogs.find((blog) => blog.id === blogId);
        if (!blogNameValue) {
            return blogNameValue;
        }
        else {
            const newPost = {
                id: (0, crypto_1.randomUUID)(),
                title,
                shortDescription,
                content,
                blogId,
                blogName: blogNameValue.name,
            };
            project_db_1.db.posts.push(newPost);
            return newPost;
        }
    },
};
//# sourceMappingURL=posts-repository.js.map