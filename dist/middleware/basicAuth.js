"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
let authValue;
let basicAuthMiddleware = (req, res, next) => {
    if (req.method === "GET") {
        return next();
    }
    authValue = req.get("Authorization");
    if (!authValue) {
        res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .set("WWW-Authenticate", "Basic")
            .send();
    }
    else {
        let credentials = Buffer.from(authValue.split(" ")[1], "base64")
            .toString()
            .split(":");
        let username = credentials[0];
        let password = credentials[1];
        if (!(username === "admin" && password === "qwerty")) {
            res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .set("WWW-Authenticate", "Basic")
                .send();
        }
        next();
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
//# sourceMappingURL=basicAuth.js.map