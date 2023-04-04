"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoInputValidation = exports.validatePostBody = void 0;
const data_types_1 = require("./../dto/data.types");
const isResolution = (x) => data_types_1.resolutions.includes(x);
const validatePostBody = (body) => {
    const { title, author, availableResolutions } = body;
    const errors = [];
    if (!title || !title.trim()) {
        errors.push({ message: "Title is invalid", field: "title" });
    }
    else if (typeof title !== "string") {
        errors.push({ message: "Title must be of type 'string'", field: "title" });
    }
    else if (title.length > 40) {
        errors.push({
            message: "Title's maximum length must be 40",
            field: "title",
        });
    }
    console.log("errors: ", errors);
    return errors;
};
exports.validatePostBody = validatePostBody;
exports.videoInputValidation = {
    validateTitleAndAuthor(requestProperty, maxLength) {
        if (!requestProperty ||
            typeof requestProperty !== "string" ||
            !requestProperty.trim()) {
            return false;
        }
        else if (requestProperty.trim().length > maxLength) {
            return false;
        }
        else
            return true;
    },
    validateResolution(resolutions) {
        if (resolutions.length === 0) {
            return false;
        }
        else {
            let result;
            const errorResolution = resolutions.find((element) => {
                result = isResolution(element);
                return result;
            });
            return errorResolution;
        }
    },
    validateMinAgeRestriction(minAgeRestriction) {
        if (minAgeRestriction < 1 || minAgeRestriction > 18) {
            return false;
        }
        else
            return true;
    },
    validateCanBeDownloaded(canBeDownloaded) {
        if (typeof canBeDownloaded !== "boolean") {
            return false;
        }
        else
            return true;
    },
};
//# sourceMappingURL=inputRequestValidator.js.map