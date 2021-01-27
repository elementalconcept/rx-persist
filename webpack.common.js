const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const distDir = path.resolve(__dirname, 'dist');

module.exports = {
  entry: [
    './src/index.ts',
    './src/package.json'
  ],

  output: {
    filename: 'index.js',
    path: distDir,
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
  },

  optimization:{
    usedExports: false
  },

  plugins: [
    new CleanWebpackPlugin(),

    new CopyPlugin({
      patterns: [
        { from: './src/package.json', to: distDir }
      ]
    })
  ]
};
