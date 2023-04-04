"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicationVideoDate = exports.creationVideoDate = void 0;
exports.creationVideoDate = new Date().toISOString();
exports.publicationVideoDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
//# sourceMappingURL=creation-publication-dates.js.map