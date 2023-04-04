"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePostBody = void 0;
const data_types_1 = require("./../dto/data.types");
const videoTitleAuthorValidation_1 = require("./videoTitleAuthorValidation");
const isResolution = (x) => data_types_1.resolutions.includes(x);
const validatePostBody = (body) => {
    const { title, author, availableResolutions } = body;
    const errors = [];
    const titleErrors = (0, videoTitleAuthorValidation_1.videoTitleAuthorValidation)(title, 40, "Title");
    const authorErrors = (0, videoTitleAuthorValidation_1.videoTitleAuthorValidation)(author, 40, "Author");
    if (availableResolutions === undefined) {
        errors.push({
            message: "Please include at least 1 resolution",
            field: "available resolutions",
        });
    }
    else if (availableResolutions.length === 0) {
        errors.push({
            message: "Please include at least 1 resolution",
            field: "available resolutions",
        });
    }
    else {
        let result;
        availableResolutions
            .filter((element) => {
            result = isResolution(element);
            return result === false;
        })
            .map((el) => errors.push({
            message: `Resolution ${el} is invalid`,
            field: "video resolutions",
        }));
    }
    return [...titleErrors, ...authorErrors, ...errors];
};
exports.validatePostBody = validatePostBody;
//# sourceMappingURL=inputRequestValidator.js.map