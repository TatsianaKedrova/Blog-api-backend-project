"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuardMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const abc = "Basic YWRtaW46cXdlcnR5";
let credentials = Buffer.from(abc.split(" ")[1], "base64").toString();
//   .split(":");
console.log("credentials: ", credentials);
let authGuardMiddleware = (req, res, next) => {
    const authValue = req.get("Authorization");
    //If Authorization header not present
    if (!authValue) {
        const error = new Error("Not Authenticated!");
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).set("WWW-Authenticate", "Basic");
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
exports.authGuardMiddleware = authGuardMiddleware;
//# sourceMappingURL=auth.js.map