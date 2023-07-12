const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const nextConfig = {
  basePath: "",
  reactStrictMode: false,
  experimental: {
    appDir: true,
    serverActions: true,
  },
  webpack: (config, { isServer, dev }) => {
    const wasmDest = "../.next/static/chunks/app";
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
    };
    // config.output.webassemblyModuleFilename =
    //   "static/chunks/pages/scichart2d.wasm";
    // config.devServer = {
    //   ...config.devServer,
    //   devMiddleware: { writeToDisk: true },
    // };
    return config;
  },
};

module.exports = nextConfig;
