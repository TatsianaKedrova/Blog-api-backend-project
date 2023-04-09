"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = exports.blogsList = void 0;
const project_db_1 = require("../temporal-database/project-db");
const crypto_1 = require("crypto");
exports.blogsList = project_db_1.db.blogs;
exports.blogsRepository = {
    getListOfBlogs() {
        return exports.blogsList;
    },
    findBlogById(id) {
        const foundBlogById = project_db_1.db.blogs.find((element) => element.id === id);
        return foundBlogById;
    },
    createNewBlog(body) {
        const { name, description, websiteUrl } = body;
        const newBlog = {
            id: (0, crypto_1.randomUUID)(),
            name,
            description,
            websiteUrl,
        };
        project_db_1.db.blogs.push(newBlog);
        return newBlog;
    },
    updateBlogById(id) {
        const foundBlog = project_db_1.db.blogs.find((blog) => blog.id === id);
        if (foundBlog) {
        }
        return foundBlog;
    },
    deleteBlogById(id) {
        for (let i = 0; i < project_db_1.db.blogs.length; i++) {
            if (project_db_1.db.blogs[i].id === id) {
                project_db_1.db.blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    },
};
//# sourceMappingURL=blogs-repository.js.map