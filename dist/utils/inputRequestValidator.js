"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideoInputValidation = void 0;
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
exports.createVideoInputValidation = {
    validateTitleAndAuthor(requestProperty, maxLength) {
        if (!requestProperty || !requestProperty.trim()) {
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
};
//# sourceMappingURL=inputRequestValidator.js.map