const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

const OUTPUT = path.resolve(__dirname, "dist");
const port = 9001;

module.exports = {
  entry: [
    `webpack-dev-server/client?http://localhost:${port}`,
    "webpack/hot/only-dev-server",
    "./src/index.js",
  ],
  mode: "development",
  devtool: "inline-source-map",
  optimization: { usedExports: true },
  output: {
    path: OUTPUT,
    publicPath: "/",
    filename: "[name].bundle.js",
  },
  devServer: {
    clientLogLevel: "silent",
    contentBase: OUTPUT,
    compress: true,
    hot: true,
    port,
    publicPath: "/",
    disableHostCheck: true,
    historyApiFallback: false,
  },
  resolve: {
    alias: {
      styles: path.resolve(__dirname, "./src/styles"),
    },
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/(node_modules\/)/],
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]___[hash:base64:5]",
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.svg$/,
        loader: "@svgr/webpack",
      },
      {
        test: /\.(eot|woff|woff2|ttf|png|jpg|gif)$/,
        exclude: [/(node_modules\/)/],
        use: "file-loader",
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({ template: "src/index.html" }),
  ],
};
