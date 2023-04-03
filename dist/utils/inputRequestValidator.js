"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoInputValidation = void 0;
const resolutions = [
    "P144",
    "P240",
    "P360",
    "P480",
    "P720",
    "P1080",
    "P1440",
    "P2160",
];
const isResolution = (x) => resolutions.includes(x);
exports.videoInputValidation = {
    validateTitleAndAuthor(requestProperty, maxLength) {
        if (!requestProperty || typeof requestProperty !== "string" || !requestProperty.trim()) {
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
    }
};
//# sourceMappingURL=inputRequestValidator.js.map