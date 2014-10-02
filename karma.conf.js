module.exports = function (config) {

  config.set({
    frameworks: ['mocha', 'chai-sinon'],
    browsers: ['PhantomJS'],
    plugins: [
      'karma-mocha',
      'karma-typescript-preprocessor',
      'karma-phantomjs-launcher',
      'karma-chai-sinon'
    ],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/lodash/dist/lodash.js',
      'dist/js/templates.js',
      'dist/js/app.js',
      'app/tests/unit/**/*.js'
    ],
    exclude: ['app/tests/integration/**/*.js'],
    preprocessors: {
      '**/*.ts': ['typescript']
    },
    typescriptPreprocessor: {
      // options passed to the typescript compiler
      options: {
        sourceMap: false, // (optional) Generates corresponding .map file.
        target: 'ES5', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
        module: 'amd', // (optional) Specify module code generation: 'commonjs' or 'amd'
        noImplicitAny: true, // (optional) Warn on expressions and declarations with an implied 'any' type.
        noResolve: true, // (optional) Skip resolution and preprocessing.
        removeComments: true // (optional) Do not emit comments to output.
      }
    }
  });

};