var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
$.ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var pagespeed = require('psi');
var fs = require('graceful-fs');
var modRewrite = require('connect-modrewrite');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var production = !!$.util.env.production;
$.util.log('Environment', $.util.colors.blue(production ? 'Production' : 'Development'));

// <paths>
var paths = {
  "src": "./src",
  "dev": "./dist",
  "stage": "./dist",
  "bower": "./bower_components/**/*.{js,css,map}",
  js: {},
  html: {}
};
paths.ddest = production ? paths.stage : paths.dev;
paths.js.src = paths.src + "/app/**/*";
paths.js.dest = paths.ddest + "/js";
//paths.bower = production ? paths.bower + ".min.js" : paths.bower + ".js";
paths.vendor = paths.ddest + "/libs";
paths.html.src = paths.src + "/index.html";
paths.html.dest = paths.dest + "/index.html";
// </paths>

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Optimize Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
      .pipe($.cache($.imagemin({
        progressive: true,
        interlaced: true
      })))
      .pipe(gulp.dest('dist/images'))
      .pipe($.size({title: 'images'}));
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
  return gulp.src(['app/fonts/**'])
      .pipe(gulp.dest('dist/fonts'))
      .pipe($.size({title: 'fonts'}));
});

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
  var f = production ? 'styles.min.css' : 'styles.css';

  return gulp.src('app/styles/*.less')
      .pipe($.changed('styles', {extension: '.less'}))
      .pipe($.less())
      .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
      .pipe($.concat(f))
      .pipe($.if(production, $.csso()))
    // Concatenate And Minify Styles
      .pipe(gulp.dest('dist/css'))
      .pipe($.size({title: 'styles'}));
});

gulp.task('js:bower', function () {
  var filter = production ? $.filter('**/*.min.{js,css}') : $.filter('**/*.{js,css}');
  var stream = gulp.src(paths.bower);

  if (production) {
    stream
        .pipe(filter)
        .pipe($.rev())
        .pipe(gulp.dest(paths.vendor))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(paths.vendor))
        .pipe(filter.restore());
  }

  return stream.pipe(gulp.dest('dist/libs'))
      .pipe($.size({title: 'js:bower'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('rev', ['html'], function () {
  var assets = $.useref.assets({searchPath: 'dist'});
  var stream = gulp.src('dist/index.html');

  if (production) {
    var manifest = paths.vendor + "/rev-manifest.json";
    var vendorFiles = fs.existsSync(manifest) ? require(manifest) : [];

    for (var file in vendorFiles) {
      if (vendorFiles.hasOwnProperty(file)) {
        stream = stream.pipe($.replace(file, vendorFiles[file]));
      }
    }

    stream.pipe(assets)
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest('dist'))
        .pipe($.gzip())
        .pipe(gulp.dest('dist'));
  }

  return stream
      .pipe(gulp.dest('dist'))
      .pipe($.size({title: 'rev'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', ['js:bower', 'ng:templates'], function () {
  var stream = gulp.src('app/index.html');

  if (production) {
    stream
        .pipe($.replace('.js', '.min.js'))
        .pipe($.replace('.css', '.min.css'))
        .pipe(
        $.cdnizer({
          allowRev: true,
          allowMin: true,
          fallbackScript: "<script>function cdnizerLoad(u) {document.write('<scr'+'ipt src=\"'+u+'\"></scr'+'ipt>');}</script>",
          fallbackTest: '<script>if(typeof ${ test } === "undefined") cdnizerLoad("${ filepath }");</script>',
          files: [
            'google:angular',
            {
              cdn: 'cdnjs:lodash.js',
              package: 'lodash',
              test: '_'
            }
          ]}))
  }
  return stream
      .pipe(gulp.dest('dist'))
      .pipe($.size({title: 'html'}));
});

// <tests>

gulp.task('karma:once', function () {
  // Be sure to return the stream
  return gulp.src('app/test/**/*.js')
      .pipe($.karma({
        configFile: 'karma.conf.js',
        noResolve: true,
        action: 'run'
      }))
      .on('error', function (err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
});

gulp.task('karma:watch', function () {
  return gulp.src('app/scripts/**/*.ts')
      .concat('app.js')
      .pipe(karma({
        configFile: 'karma.conf.js',
        action: 'watch'
      }));
});

gulp.task('webdriver', $.protractor.webdriver_update);

gulp.task('protractor', ['webdriver'], function () {
  return gulp.src(globs.integration)
      .pipe($.protractor.protractor({configFile: 'protractor.conf.js'}));
});
// </tests>

// <typescript>
gulp.task('ts:lint', function () {
  return gulp.src('app/scripts/**/*.ts')
      .pipe($.tslint())
      .pipe($.tslint.report('prose', {emitError: true}));
});

var tsProject = $.typescript.createProject({
  sortOutput: true,
  declarationFiles: true,
  noExternalResolve: false
});

gulp.task('ts:compile', function () {
  var f = production ? 'app.min.js' : 'app.js';
  var tsResult = gulp.src('app/**/*.ts')

      .pipe($.typescript(tsProject));

  tsResult.dts.pipe(gulp.dest('dist/dts'));

  return tsResult.js
      .pipe($.sourcemaps.init())
      .pipe($.concat(f))
      .pipe($.ngAnnotate())
      .pipe($.if(production, $.uglify()))
      .pipe($.wrap({ src: './iife.txt'}))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('dist/js'))
      .pipe($.size({title: 'typescript'}));
});
// </typescript>

// <ng-templates>
gulp.task('ng:templates', function () {
  var f = production ? 'templates.min.js' : 'templates.js';

  return gulp.src('app/scripts/**/templates/*.html')
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.ngHtml2js({
        moduleName: function (file) {
          var path = file.path.split('/'),
              folder = path[path.length - 2];
          return folder.replace(/-[a-z]/g, function (match) {
            return match.substr(1).toUpperCase() + 'templates';
          });
        }
      }))
      .pipe($.concat(f))
      .pipe($.if(production, $.uglify()))
      .pipe(gulp.dest('dist/js'))
      .pipe($.size({title: 'ng:templates'}));
});
// </ng-templates>

// Watch Files For Changes & Reload
gulp.task('serve', ['default'], function () {
  var bsOpts = {
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      middleware: [
        modRewrite(['!\\.html|\\images|\\.js|\\.css|\\.png|\\.jpg|\\.woff|\\.ttf|\\.svg /index.html [L]'])
      ],
      baseDir: 'dist'
    }
  };
//    bsOpts.tunnel = production ? 'oicrgdcdev' : false;

  browserSync(bsOpts);

  if (!production) {
    gulp.watch(['app/**/*.html'], ['html', reload]);
    gulp.watch(['app/styles/**/*.{less,css}'], ['styles', reload]);
    gulp.watch(['app/scripts/**/*.ts'], ['ts:lint', 'ts:compile', reload]);
    gulp.watch(['app/scripts/**/*.html'], ['ng:templates', reload]);
    gulp.watch(['app/images/**/*'], ['images', reload]);
  }
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['rev', 'images', 'fonts', 'ts:compile'], cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
  // By default, we use the PageSpeed Insights
  // free (no API key) tier. You can use a Google
  // Developer API key if you have one. See
  // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
  url: 'https://oicrgdcdev.localtunnel.me',
  strategy: 'mobile'
}));

// Load custom tasks from the `tasks` directory
try {
  require('require-dir')('tasks');
} catch (err) {
}