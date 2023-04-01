"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const examples_1 = require("../src/examples");
let a;
let b;
let c;
beforeEach(() => {
    a = 1;
    b = 2;
    c = 3;
});
test("sum should be correct", () => {
    //action
    a = a * 10;
    const result1 = (0, examples_1.sum)(a, b);
    const result2 = (0, examples_1.sum)(b, c);
    //expect result
    expect(result1).toBe(12);
    expect(result2).toBe(5);
});
test("multiplication should be correct", () => {
    //action
    const result1 = (0, examples_1.multiply)(a, b);
    const result2 = (0, examples_1.multiply)(b, c);
    //expect result
    expect(result1).toBe(2);
    expect(result2).toBe(6);
});
test("splitting into words should be correct", () => {
    //data
    const sentence1 = "I Love your great eyes but more I love your spirit!!!";
    const sentence2 = "JS     - is a programming language";
    //action
    const result1 = (0, examples_1.splitToWords)(sentence1);
    const result2 = (0, examples_1.splitToWords)(sentence2);
    //expect result
    expect(result1.length).toBe(11);
    expect(result1[2]).toBe("your");
    expect(result1[1]).toBe("love");
    expect(result2[1]).toBe("is");
});
