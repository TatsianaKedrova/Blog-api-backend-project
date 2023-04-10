"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsStringsValidator = exports.isValidBlogId = void 0;
const express_validator_1 = require("express-validator");
const project_db_1 = require("../../temporal-database/project-db");
const isValidBlogId = (blogId) => {
    const blogNameValue = project_db_1.db.blogs.find((blog) => blog.id === blogId);
    if (!blogNameValue) {
        return Promise.reject("blogId with this value doesn't exist");
    }
    return true;
};
exports.isValidBlogId = isValidBlogId;
const postsStringsValidator = (field, maxLength) => {
    return (0, express_validator_1.check)(field)
        .exists()
        .withMessage(`${field} field is required`)
        .isString()
        .trim()
        .withMessage(`${field} should be of type String`)
        .notEmpty()
        .withMessage(`${field} must be included in request body`)
        .isLength({ max: maxLength })
        .withMessage(`${field}'s max length is 30`);
};
exports.postsStringsValidator = postsStringsValidator;
//# sourceMappingURL=postsValidator.js.map