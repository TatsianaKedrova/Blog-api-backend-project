"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiply = exports.sum = exports.splitToWords = void 0;
//functions for tests
function splitToWords(sentence) {
    const arrayOfWords = sentence
        .replace(/[-!.,]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .map((element) => element.toLowerCase());
    return arrayOfWords;
}
exports.splitToWords = splitToWords;
console.log(splitToWords("JS  - is a programming language"));
function sum(a, b) {
    return a + b;
}
exports.sum = sum;
function multiply(a, b) {
    return a * b;
}
exports.multiply = multiply;
//# sourceMappingURL=examples.js.map