// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: [ 'jasmine', 'webpack' ],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-webpack')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../../coverage'),
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    files: [
      { pattern: 'src/test.ts', watched: false }
    ],
    preprocessors: {
      'src/test.ts': [ 'webpack' ]
    },
    reporters: [ 'progress', 'kjhtml' ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [ 'ChromeHeadlessCustom' ],
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        flags: [ '--no-sandbox' ]
      }
    },
    webpack: {
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
      }
    },
    singleRun: false
  });
};
