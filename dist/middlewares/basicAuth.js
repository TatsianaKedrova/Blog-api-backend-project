"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
let authValue;
let basicAuthMiddleware = (req, res, next) => {
    authValue = req.get("Authorization");
    if (!authValue) {
        res.set({
            "WWW-Authenticate": "Basic",
        });
        res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    else {
        let credentials = Buffer.from(authValue.split(" ")[1], "base64")
            .toString()
            .split(":");
        let authType = authValue.split(" ")[0].toLowerCase();
        let username = credentials[0];
        let password = credentials[1];
        if (!(authType === "basic" && username === "admin" && password === "qwerty")) {
            res.set({
                "WWW-Authenticate": "Basic",
            });
            res.sendStatus(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        else {
            next();
        }
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
//# sourceMappingURL=basicAuth.js.map