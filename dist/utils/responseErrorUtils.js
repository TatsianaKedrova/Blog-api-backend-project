"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseErrorFunction = void 0;
const responseErrorFunction = (message, field) => {
    return {
        errorsMessages: [{ message, field }],
    };
};
exports.responseErrorFunction = responseErrorFunction;
//# sourceMappingURL=responseErrorUtils.js.map