const path = require('path');

module.exports = {
  entry: './src/index.ts',

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'rx-persist',
    libraryTarget: 'umd'
  },

  resolve: {
    extensions: [ '.ts', '.js' ],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  externals: {

  }
};
