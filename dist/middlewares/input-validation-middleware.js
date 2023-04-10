"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const responseErrorTransformerUtil_1 = require("../utils/common-utils/responseErrorTransformerUtil");
const responseErrorUtils_1 = require("../utils/common-utils/responseErrorUtils");
const http_status_codes_1 = require("http-status-codes");
const inputValidationMiddleware = (req, res, next) => {
    const errors = (0, responseErrorTransformerUtil_1.responseErrorTransformerFunction)(req);
    if (errors.length > 0) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send((0, responseErrorUtils_1.responseErrorFunction)(errors));
    }
    else {
        next();
    }
};
exports.inputValidationMiddleware = inputValidationMiddleware;
//# sourceMappingURL=input-validation-middleware.js.map