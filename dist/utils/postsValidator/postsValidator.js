"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsValidator = exports.stringsInputValidator = exports.stringInputValidatorCommon = exports.isValidBlogId = void 0;
const express_validator_1 = require("express-validator");
const project_db_1 = require("../../temporal-database/project-db");
const isValidBlogId = (blogId) => {
    const blog = project_db_1.db.blogs.find((blog) => blog.id === blogId);
    if (!blog) {
        throw new Error("Blog with such ID doesn't exist");
    }
    return true;
};
exports.isValidBlogId = isValidBlogId;
const stringInputValidatorCommon = (field) => {
    return (0, express_validator_1.body)(field)
        .exists()
        .withMessage(`${field} field is required`)
        .isString()
        .trim()
        .withMessage(`${field} should be of type String`)
        .notEmpty()
        .withMessage(`${field} must be included in request body`);
};
exports.stringInputValidatorCommon = stringInputValidatorCommon;
const stringsInputValidator = (field, maxLength) => {
    return (0, exports.stringInputValidatorCommon)(field)
        .isLength({ max: maxLength })
        .withMessage(`${field}'s max length is ${maxLength}`);
};
exports.stringsInputValidator = stringsInputValidator;
exports.postsValidator = [
    (0, exports.stringsInputValidator)("title", 30),
    (0, exports.stringsInputValidator)("shortDescription", 100),
    (0, exports.stringsInputValidator)("content", 1000),
    (0, exports.stringInputValidatorCommon)("blogId").custom(exports.isValidBlogId),
];
//# sourceMappingURL=postsValidator.js.map