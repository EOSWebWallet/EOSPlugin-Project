const path = require('path');

module.exports = {
  entry: {
    background: './src/background.ts'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist/Plugin'),
    filename: '[name].js'
  }
};
