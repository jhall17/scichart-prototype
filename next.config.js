/** @type {import('next').NextConfig} */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const nextConfig = {
  basePath: "",
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    const wasmDest = "static/chunks/pages";
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          // { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
          {
            from: "node_modules/scichart/_wasm/scichart2d.wasm",
            to: wasmDest,
          },
        ],
      })
    );
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    };
    config.output.webassemblyModuleFilename =
      "static/chunks/pages/scichart2d.wasm";
    // config.devServer = {
    //   ...config.devServer,
    //   devMiddleware: { writeToDisk: true },
    // };
    return config;
  },
};

module.exports = nextConfig;
