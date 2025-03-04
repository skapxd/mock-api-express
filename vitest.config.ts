import { resolve } from "node:path";

import { configDefaults, defineConfig } from "vitest/config";

const testResultDir = resolve(__dirname, "test-reporter");

const alias = {
  "#": resolve(__dirname),
};

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "html", "clover", "lcov", "cobertura"],
      reportsDirectory: resolve(testResultDir, "coverage"),
      include: ["src/**/*.ts"],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    outputFile: {
      html: resolve(testResultDir, "index.html"),
      junit: resolve(testResultDir, "junit-report.xml"),
    },
    reporters: ["default", "html", ["junit", { suiteName: "UI tests" }]],
    globals: true,
    root: "./",
  },
  resolve: {
    alias,
  },
  
});
