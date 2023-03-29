//functions for tests
export function splitToWords(sentence: string) {
    const arrayOfWords = sentence
      .replace(/[-!.,]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .map((element) => element.toLowerCase());
    return arrayOfWords;
  }
  console.log(splitToWords("JS  - is a programming language"));
  
  export function sum(a: number, b: number) {
    return a + b;
  }
  
  export function multiply(a: number, b: number) {
    return a * b;
  }