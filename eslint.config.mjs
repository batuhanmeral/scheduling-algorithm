import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Bu dosyalar yalnızca tarayıcıda bulunan durumu (URL, localStorage,
    // matchMedia) mount sonrası bir kez okuyup state'e yazar. useState
    // başlangıç değerine taşımak SSR/hydration uyuşmazlığı doğurur; kural
    // gerçek bir hata değil, performans önerisi olduğu için yalnızca bu
    // dosyalarda kapatıldı.
    files: [
      "app/page.tsx",
      "components/LanguageProvider.tsx",
      "components/ThemeToggle.tsx",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
