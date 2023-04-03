"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResolutions = exports.validateRequestBody = void 0;
const http_status_codes_1 = require("http-status-codes");
const responseErrorUtils_1 = require("./responseErrorUtils");
const validateRequestBody = (requestProperty, maxLength, errorMessage, res) => {
    if (!requestProperty.trim()) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json((0, responseErrorUtils_1.responseErrorFunction)(`${errorMessage} is invalid`, `${errorMessage}`));
        return;
    }
    else if (requestProperty.trim().length > maxLength) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json((0, responseErrorUtils_1.responseErrorFunction)(`Max length of ${errorMessage} should be ${maxLength}`, `${errorMessage}`));
        return;
    }
};
exports.validateRequestBody = validateRequestBody;
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
const validateResolutions = (resolutions, res) => {
    if (resolutions.length === 0) {
        res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json((0, responseErrorUtils_1.responseErrorFunction)("There should be at least one resolution for created video", "Resolution"));
        return;
    }
    resolutions.map((element) => {
        const result = isResolution(element);
        if (!result) {
            res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json((0, responseErrorUtils_1.responseErrorFunction)(`Resolution ${element} doesn't exist`, "Resolution"));
        }
    });
};
exports.validateResolutions = validateResolutions;
//# sourceMappingURL=inputRequestValidator.js.map