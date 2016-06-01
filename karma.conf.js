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
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-gettext/dist/angular-gettext.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/restangular/dist/restangular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/ngprogress-lite/ngprogress-lite.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/lodash/lodash.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-notify/angular-notify.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
      '.tmp/scripts/**/*.js',
      'app/scripts/**/*.tests.js',
      'app/scripts/**/tests/*.js'
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
      dir: 'coverage',
      reporters: [
        {type: 'html'},
        {type: 'lcovonly', subdir: '.', file: 'lcov.info'}
      ]
    }
  });

};
