import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      reporter: ["text", "cobertura"],
      provider: "istanbul",
      include: [
        "src/**/*.{ts,tsx}",
      ],
    },
    exclude: [
      ...configDefaults.exclude
    ],
  },
});
