import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";
import { visualizer } from "rollup-plugin-visualizer";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

// Bundle analysis configuration
const analyzeConfig = {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: false,
      compact: true,
      inlineDynamicImports: true,
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: false,
      compact: true,
      inlineDynamicImports: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false,
      mainFields: ["browser", "module", "main"],
    }),
    commonjs({
      exclude: [
        "aws-sdk",
        "@aws-sdk/client-s3",
        "@aws-sdk/s3-request-presigner",
        "@supabase/supabase-js",
        "firebase",
        "cloudinary",
      ],
    }),
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      compilerOptions: {
        target: "es2018",
        module: "esnext",
        declaration: true,
        declarationMap: false,
        sourceMap: false,
      },
    }),
    postcss({
      extract: true,
      minimize: true,
    }),
    // Bundle analyzer plugin
    visualizer({
      filename: "dist/bundle-analysis.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: "treemap", // or "sunburst", "treemap", "network"
    }),
  ],
  external: [
    "react",
    "react-dom",
    "@aws-sdk/client-s3",
    "@aws-sdk/s3-request-presigner",
    "@supabase/supabase-js",
    "firebase",
    "cloudinary",
    "browser-image-compression",
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
};

// TypeScript definitions
const typesConfig = {
  input: "src/index.ts",
  output: [{ file: "dist/index.d.ts", format: "esm" }],
  plugins: [dts()],
  external: [/\.css$/],
};

export default [analyzeConfig, typesConfig];
