"use strict";

const webpack = require('webpack');
const path = require('path');
const pack = require('./package.json');

let entry = {
  localization: "./src/localization.js"
};

let plugins = [];
let minimize = process.env.MINIMIZE;
let watch = !process.env.BUILD;

let banner = `Localization module\n
@version ${pack.version}
@author Alexandr Balasyan <mywebstreet@gmail.com>
{@link https://github.com/ortexx/localizationjs}`;

plugins.push(new webpack.BannerPlugin({
  banner: banner.trim()
}));

plugins.push(new webpack.optimize.UglifyJsPlugin({
  include: /\.min\.js$/,
  minimize: true,
  compress: {
    warnings: false
  }
}));

minimize && (entry['localization.min'] = entry['localization']);

const config = {
  watch: watch,
  bail: true,
  devtool: "inline-source-map",
  entry: entry,
  output: {
    library: 'Localization',
    libraryTarget: 'umd',
    path: path.join(__dirname, "/dist"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env']
        }
      }
    ]
  },
  plugins: plugins
};

module.exports = config;