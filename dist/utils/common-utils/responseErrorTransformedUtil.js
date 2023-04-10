"use strict";
const responseErrorTransformer = validationResult(req);
if (!validationErrors.isEmpty()) {
    const errors = validationErrors
        .array({ onlyFirstError: true })
        .map((error) => {
        return {
            message: error.msg,
            field: error.param,
        };
    });
}
//# sourceMappingURL=responseErrorTransformedUtil.js.map