import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.{ts,tsx}"],
    exclude: [...configDefaults.exclude, ".next/**"],
    coverage: {
      provider: "v8",
      // Test edilmeyen dosyalar da 0% olarak raporlansın diye tüm kaynak dahil.
      include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.ts"],
      exclude: ["**/*.test.{ts,tsx}"],
      reporter: ["text", "html"],
      // Ölçülen değerin hemen altı (2026-11-18: stmt 56.25, branch 60.67,
      // func 47.68, line 56.23). UI testleri eklendikçe yükseltilecek.
      thresholds: {
        statements: 56,
        branches: 60,
        functions: 47,
        lines: 56,
      },
    },
  },
});
