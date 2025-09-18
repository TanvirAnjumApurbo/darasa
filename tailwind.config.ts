import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

// Tailwind v4 config (canary). Using plugin options to scope typography classes
// so only `.markdown` generates rich text styles.
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}", "./app/**/*.{ts,tsx,mdx}"],
  plugins: [typography({ className: "markdown" })],
};

export default config;
