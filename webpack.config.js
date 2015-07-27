var path = require('path');

module.exports = {
  entry: './frontend/main.jsx',
  output: {
    filename: 'public/js/main.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      }
    ]
  },
};
