"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
let basicAuthMiddleware = (req, res, next) => {
    const authValue = req.get("Authorization");
    //If Authorization header not present
    if (!authValue) {
        const error = new Error("Not Authenticated!");
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED) /*.set("WWW-Authenticate", "Basic")*/;
        next(error);
    }
    //If Authorization header present
    else {
        let credentials = Buffer.from(authValue.split(" ")[1], "base64")
            .toString()
            .split(":");
        let username = credentials[0];
        let password = credentials[1];
        if (!(username === "admin" && password === "qwerty")) {
            const error = new Error("Not Authenticated!");
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).set("WWW-Authenticate", "Basic");
            next(error);
        }
        res.status(http_status_codes_1.StatusCodes.OK);
        next();
    }
};
exports.basicAuthMiddleware = basicAuthMiddleware;
//# sourceMappingURL=basicAuth.js.map