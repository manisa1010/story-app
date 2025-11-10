// webpack.prod.js

const path = require("path"); // Tambahkan path untuk resolusi folder
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); // <-- Plugin yang kita butuhkan

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

    // ** Tambahkan CopyWebpackPlugin di sini **
    new CopyWebpackPlugin({
      patterns: [
        // 1. Salin Service Worker (Kriteria 3 & 2)
        {
          from: path.resolve(__dirname, "src/sw.js"),
          to: path.resolve(__dirname, "dist/sw.js"),
          noErrorOnMissing: true, // Tidak error jika file belum dibuat
        },
        // 2. Salin Manifest (Kriteria 3)
        {
          from: path.resolve(__dirname, "src/manifest.json"),
          to: path.resolve(__dirname, "dist/manifest.json"),
          noErrorOnMissing: true,
        },
        // 3. Salin Folder Ikon (Kriteria 3)
        {
          from: path.resolve(__dirname, "src/icons"),
          to: path.resolve(__dirname, "dist/icons"),
          noErrorOnMissing: true,
        },
        // 4. Salin Redirects (Kriteria 5: Deployment Netlify)
        {
          from: path.resolve(__dirname, "src/_redirects"),
          to: path.resolve(__dirname, "dist/_redirects"),
          noErrorOnMissing: true,
        },
      ],
    }),
    // ** Akhir CopyWebpackPlugin **
  ],
});
