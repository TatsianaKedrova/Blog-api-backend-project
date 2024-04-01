const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 100000,
  testRegex: ".e2e.tests.ts$",
  setupFiles: ["dotenv/config"],
  globals: {
    window: {},
  },
};

module.exports = config;
