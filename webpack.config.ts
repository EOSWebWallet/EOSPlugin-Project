const path = require('path');

module.exports = {
  entry: {
    background: './src/background.ts',
    content: './src/content.ts',
    inject: './src/inject.ts',
    plugin: './src/plugin.ts'
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
