import { describe, expect, it } from "vitest";
import { translations } from "./i18n";

describe("simulator branding", () => {
  it.each(["tr", "en"] as const)("uses the project name in the %s heading", (language) => {
    expect(translations[language].appTitle).toBe("Scheduling Algorithm Simulator");
  });
});
