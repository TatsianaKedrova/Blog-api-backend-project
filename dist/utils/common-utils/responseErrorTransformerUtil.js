"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseErrorTransformerFunction = void 0;
const express_validator_1 = require("express-validator");
const responseErrorTransformerFunction = (request) => {
    const validationErrors = (0, express_validator_1.validationResult)(request);
    if (!validationErrors.isEmpty()) {
        const errors = validationErrors
            .array({ onlyFirstError: true })
            .map((error) => {
            return {
                message: error.msg,
                field: error.param,
            };
        });
        return errors;
    }
    else {
        return [];
    }
};
exports.responseErrorTransformerFunction = responseErrorTransformerFunction;
//# sourceMappingURL=responseErrorTransformerUtil.js.map