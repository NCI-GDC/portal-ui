module.exports = function (config) {

  config.set({
    frameworks: ['mocha', 'chai-sinon'],
    browsers: ['PhantomJS'],
    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-coverage',
      'karma-phantomjs-launcher',
      'karma-chai-sinon'
    ],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/restangular/dist/restangular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/lodash/dist/lodash.js',
      '.tmp/scripts/**/*.js',
      'app/scripts/**/*.tests.js'
    ],
    exclude: ['app/tests/integration/**/*.js'],
    preprocessors: {
      '.tmp/scripts/**/*.js': ['coverage']
    },
    colors: true,
    autoWatch: true,
    singleRun: false,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    reporters: ['mocha', 'coverage'],
    // reporter options
    mochaReporter: {
      output: 'autowatch'
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    }
  });

};