"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePostBody = void 0;
const videoResolutionValidator_1 = require("./videoResolutionValidator");
const videoTitleAuthorValidator_1 = require("./videoTitleAuthorValidator");
const validatePostBody = (body) => {
    const { title, author, availableResolutions } = body;
    const errors = [];
    const titleErrors = (0, videoTitleAuthorValidator_1.videoTitleAuthorValidation)(title, 40, "title");
    const authorErrors = (0, videoTitleAuthorValidator_1.videoTitleAuthorValidation)(author, 20, "author");
    const resolutionsErrors = (0, videoResolutionValidator_1.videoResolutionValidator)(availableResolutions);
    return [...errors, ...titleErrors, ...authorErrors, ...resolutionsErrors];
};
exports.validatePostBody = validatePostBody;
//# sourceMappingURL=videoPostRequestValidator.js.map