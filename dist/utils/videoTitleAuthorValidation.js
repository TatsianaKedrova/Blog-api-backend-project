"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoTitleAuthorValidation = void 0;
const videoTitleAuthorValidation = (title_or_author, maxLength, field) => {
    const errors = [];
    if (title_or_author === undefined || title_or_author === null) {
        errors.push({ message: `Please include a valid ${field}`, field });
    }
    else if (typeof title_or_author !== "string") {
        errors.push({ message: `${field} must be of type 'string'`, field });
    }
    else if (!title_or_author.trim()) {
        errors.push({ message: `${field} is invalid`, field });
    }
    else if (title_or_author.length > maxLength) {
        errors.push({
            message: `${field}'s maximum length must be ${maxLength}`,
            field,
        });
    }
    return errors;
};
exports.videoTitleAuthorValidation = videoTitleAuthorValidation;
//# sourceMappingURL=videoTitleAuthorValidation.js.map