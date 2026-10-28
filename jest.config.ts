const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 100000,
  testRegex: ".e2e.tests.ts$",
  setupFiles: ["dotenv/config", "reflect-metadata"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  transformIgnorePatterns: ["node_modules/(?!\\.pnpm/)"],
};

module.exports = config;
