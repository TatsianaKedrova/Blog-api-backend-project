"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoTitleAuthorValidation = void 0;
const videoTitleAuthorValidation = (title_or_author, maxLength, field) => {
    const errors = [];
    if (!title_or_author) {
        errors.push({ message: "Title is invalid", field: "title" });
    }
    else if (typeof title_or_author !== "string") {
        errors.push({ message: "Title must be of type 'string'", field: "title" });
    }
    else if (!title_or_author.trim()) {
        errors.push({ message: "Title is invalid", field: "title" });
    }
    else if (title_or_author.length > maxLength) {
        errors.push({
            message: "Title's maximum length must be 40",
            field: "title",
        });
    }
    return errors;
};
exports.videoTitleAuthorValidation = videoTitleAuthorValidation;
//# sourceMappingURL=videoTitleValidation.js.map