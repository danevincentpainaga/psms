const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    vendor: './src/app/vendor.js',
    main: './src/app/app.js',
  },
  watch: true,
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
    ], 
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
  ]
};