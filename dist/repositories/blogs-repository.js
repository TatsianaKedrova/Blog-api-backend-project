"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = exports.blogsList = void 0;
const project_db_1 = require("../temporal-database/project-db");
const crypto_1 = require("crypto");
exports.blogsList = project_db_1.db.blogs;
exports.blogsRepository = {
    getListOfBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return exports.blogsList;
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlogById = project_db_1.db.blogs.find((element) => element.id === id);
            return foundBlogById;
        });
    },
    createNewBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = body;
            const newBlog = {
                id: (0, crypto_1.randomUUID)(),
                name,
                description,
                websiteUrl,
            };
            project_db_1.db.blogs.push(newBlog);
            return newBlog;
        });
    },
    updateBlogById(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { description, name, websiteUrl } = body;
            const foundBlog = project_db_1.db.blogs.find((blog) => blog.id === id);
            if (!foundBlog) {
                return false;
            }
            else {
                foundBlog.name = name;
                foundBlog.description = description;
                foundBlog.websiteUrl = websiteUrl;
                return true;
            }
        });
    },
    deleteBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < project_db_1.db.blogs.length; i++) {
                if (project_db_1.db.blogs[i].id === id) {
                    project_db_1.db.blogs.splice(i, 1);
                    return true;
                }
            }
            return false;
        });
    },
};
//# sourceMappingURL=blogs-repository.js.map