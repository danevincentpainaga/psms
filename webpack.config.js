const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

var SRC = path.resolve(__dirname, './src/app/app.js');

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
      {
       test: /\.(woff|woff2|ttf|eot)$/,
       use: 'file-loader?name=fonts/[name].[ext]!static'
      },
      {
        test: /\.(eot|gif|otf|png|svg|ttf|woff)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
            },
          },
        ],
      },
    ], 
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
  ]
};