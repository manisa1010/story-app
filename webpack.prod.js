const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/sw.js"),
          to: path.resolve(__dirname, "dist/sw.js"),
          noErrorOnMissing: true,
        },

        {
          from: path.resolve(__dirname, "src/manifest.json"),
          to: path.resolve(__dirname, "dist/manifest.json"),
          noErrorOnMissing: true,
        },

        {
          from: path.resolve(__dirname, "src/icons"),
          to: path.resolve(__dirname, "dist/icons"),
          noErrorOnMissing: true,
        },

        {
          from: path.resolve(__dirname, "src/_redirects"),
          to: path.resolve(__dirname, "dist/_redirects"),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
});
