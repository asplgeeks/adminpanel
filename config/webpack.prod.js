const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

const OUTPUT = path.resolve(__dirname, "../build");

module.exports = {
  entry: ["./src/index.js"],
  mode: "production",
  devtool: "inline-source-map",
  // optimization: { usedExports: true },
  performance: {
    hints: false,
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'bundle.js',
    chunkFilename: '[id].js',
    publicPath: './'
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
  plugins: [new HtmlWebPackPlugin({ template: "src/index.html" })],
};
