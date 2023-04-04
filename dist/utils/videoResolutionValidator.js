"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoResolutionValidator = void 0;
const data_types_1 = require("../dto/data.types");
const isResolution = (x) => data_types_1.resolutions.includes(x);
const videoResolutionValidator = (availableResolutions) => {
    const errors = [];
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
            .map((wrongResolution) => errors.push({
            message: `Resolution ${wrongResolution} is invalid`,
            field: "video resolutions",
        }));
    }
    return errors;
};
exports.videoResolutionValidator = videoResolutionValidator;
//# sourceMappingURL=videoResolutionValidator.js.map