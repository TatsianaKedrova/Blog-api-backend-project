"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoResolutionValidator = void 0;
const ResolutionsVideoModel_1 = require("../../dto/videosDTO/ResolutionsVideoModel");
const isResolution = (x) => ResolutionsVideoModel_1.videoResolutions.includes(x);
const videoResolutionValidator = (availableResolutions) => {
    const errors = [];
    if (availableResolutions === undefined) {
        errors.push({
            message: "Please include at least 1 resolution",
            field: "availableResolutions",
        });
    }
    else if (availableResolutions.length === 0) {
        errors.push({
            message: "Please include at least 1 resolution",
            field: "availableResolutions",
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
            field: "availableResolutions",
        }));
    }
    return errors;
};
exports.videoResolutionValidator = videoResolutionValidator;
//# sourceMappingURL=videoResolutionValidator.js.map