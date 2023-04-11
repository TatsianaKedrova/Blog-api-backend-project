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
        const blog = project_db_1.db.blogs.find((blog) => blog.id === blogId);
        if (!blog) {
            return blog;
        }
        else {
            const newPost = {
                id: (0, crypto_1.randomUUID)(),
                title,
                shortDescription,
                content,
                blogId,
                blogName: blog.name,
            };
            project_db_1.db.posts.push(newPost);
            return newPost;
        }
    },
    updatePostById(id, body) {
        const { blogId, content, shortDescription, title } = body;
        const foundPostById = project_db_1.db.posts.find((post) => post.id === id);
        const blog = project_db_1.db.blogs.find((blog) => blog.id === blogId);
        if (!foundPostById) {
            return false;
        }
        else {
            foundPostById.blogId = blogId;
            foundPostById.content = content;
            foundPostById.shortDescription = shortDescription;
            foundPostById.title = title;
            foundPostById.blogName = blog.name;
            return true;
        }
    },
    deletePostById(id) {
        for (let i = 0; i < project_db_1.db.posts.length; i++) {
            if (project_db_1.db.posts[i].id === id) {
                project_db_1.db.posts.splice(i, 1);
                return true;
            }
        }
        return false;
    },
};
//# sourceMappingURL=posts-repository.js.map