import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/extension.ts"],
  format: ["cjs"],
  outDir: "dist",
  dts: false,
  sourcemap: true,
  clean: true,
  external: ["vscode"],
});
