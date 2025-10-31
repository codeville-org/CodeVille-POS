import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import type { Configuration } from "webpack";

import { plugins } from "./webpack.plugins";
import { rules } from "./webpack.rules";

export const mainConfig: Configuration = {
  entry: "./src/index.ts",
  module: {
    rules
  },
  plugins: [
    ...plugins,
    new CopyWebpackPlugin({
      patterns: [
        {
          // Copy the entire canvas build directory
          from: "node_modules/canvas/build/Release",
          to: "native_modules/canvas/build/Release",
          noErrorOnMissing: false
        },
        {
          // Also copy the package.json for canvas
          from: "node_modules/canvas/package.json",
          to: "native_modules/canvas/package.json",
          noErrorOnMissing: false
        }
      ]
    })
  ],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  externals: {
    canvas: "commonjs canvas"
  },
  node: {
    __dirname: false,
    __filename: false
  }
};
