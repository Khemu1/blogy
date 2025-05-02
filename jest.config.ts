import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  preset: "ts-jest",
  coverageProvider: "v8",
  testEnvironment: "node",
  testTimeout: 60000,

  // Use SWC for faster transforms
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          transform: {
            react: {
              runtime: "automatic",
            },
          },
          target: "es2021",
        },
        module: {
          type: "es6",
        },
      },
    ],
  },

  // Critical ESM configuration
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
    // Handle specific ESM packages
    "^node-fetch$": "<rootDir>/node_modules/node-fetch/src/index.js",
  },

  transformIgnorePatterns: [
    // Exclude node_modules except those that need transformation
    "node_modules/(?!(node-fetch|fetch-blob|data-uri-to-buffer|formdata-polyfill|uuid)/)",
  ],

  // Enable ESM support
  globals: {
    "ts-jest": {
      useESM: true,
      isolatedModules: true,
    },
  },

  // Environment setup
  // setupFiles: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
};

export default createJestConfig(config);
