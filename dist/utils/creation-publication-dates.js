"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateValidator = exports.dateISOPattern = exports.publicationVideoDate = exports.creationVideoDate = void 0;
exports.creationVideoDate = new Date().toISOString();
exports.publicationVideoDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
exports.dateISOPattern = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
const dateValidator = (publicationDate) => {
    const errors = [];
    if (publicationDate === null || publicationDate === undefined) {
        errors.push({
            message: "Publication date should be a valid date ISOString format",
            field: "Publication date",
        });
    }
    else if (typeof publicationDate !== "string") {
        errors.push({
            message: "Publication date should be of type String",
            field: "Publication date",
        });
    }
    else if (!exports.dateISOPattern.test(exports.creationVideoDate)) {
        errors.push({
            message: "Publication date should match this format: '/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/'",
            field: "Publication date",
        });
    }
    return errors;
};
exports.dateValidator = dateValidator;
//# sourceMappingURL=creation-publication-dates.js.map