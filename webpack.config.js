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
    extensions: [ '.ts', '.js' ]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  optimization: {
    minimize: false
  },

  externals: {
    'rxjs': {
      commonjs: 'rxjs',
      commonjs2: 'rxjs',
      amd: 'rxjs',
      root: '_'
    },
    'rxjs/operators': {
      commonjs: 'rxjs/operators',
      commonjs2: 'rxjs/operators',
      amd: 'rxjs/operators',
      root: '_'
    }
  }
};
