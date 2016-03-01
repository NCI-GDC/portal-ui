var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
$.ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var pagespeed = require('psi');
var fs = require('graceful-fs');
var packageJSON = require("./package.json");
var modRewrite = require('connect-modrewrite');
var mkdirp = require("mkdirp");

var env = {
  api: process.env.GDC_API || "http://localhost:5000",
  auth: process.env.GDC_AUTH || "https://gdc-portal.nci.nih.gov/auth",
  base: process.env.GDC_BASE || "/",
  port: process.env.GDC_PORT || 3000,
  fake_auth: process.env.GDC_FAKE_AUTH || false,
};

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

var production = false;// process.env.NODE_ENV === "production";
$.util.log('Environment', $.util.colors.blue(production ? 'Production' : 'Development'));

// <paths>
var paths = {
  "src": "./src",
  "dev": "./dist",
  "stage": "./dist",
  "bower": "./bower_components/**/*.{js,css,map,eot,svg,ttf,woff,woff2}",
  js: {},
  html: {}
};
paths.ddest = production ? paths.stage : paths.dev;
paths.js.src = paths.src + "/app/**/*";
paths.js.dest = paths.ddest + "/js";
paths.vendor = paths.ddest + "/libs";
paths.html.src = paths.src + "/index.html";
paths.html.dest = paths.dest + "/index.html";
// </paths>

gulp.task('logs', function () {
  require('conventional-changelog')({
    repository: packageJSON.repository,
    version: packageJSON.version,
    issueLink: function (id) {
      return '[OICR-' + id + '](https://jira.opensciencedatacloud.org/browse/OICR-' + id + ')'
    }
    ,from: "8b8e5953153997e8cf53c68237fadd0e7c0cacdd"
  }, function (err, log) {
    fs.writeFile('CHANGELOG.md', log);
  });
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('i18n:pot', function () {
  return gulp.src(['app/scripts/**/*.html', 'app/scripts/**/*.js'])
      .pipe($.angularGettext.extract('template.pot'))
      .pipe(gulp.dest('translations/'));
});

gulp.task('i18n:translations', ['i18n:pot'], function () {
  return gulp.src('translations/**/*.po')
      .pipe($.angularGettext.compile({
        format: 'javascript',
        defaultLanguage: 'en'
      }))
      .pipe(gulp.dest('dist/translations/'));
});

gulp.task('i18n:build', ['i18n:translations'], function () {
  var f = production ? 'translations.min.js' : 'translations.js';

  return gulp.src('dist/translations/**/*.js')
      .pipe($.concat(f))
      .pipe(gulp.dest('dist/js'));
});

// No file gets built in the case no translations exist.
// Build one to prevent 404s in browser.
gulp.task('i18n:exists', function () {
  var f = production ? "translations.min.js" : "translations.js";

  fs.readFile("dist/js/" + f, function (err) {
    if (err) {
      mkdirp("dist/js", function (err) {
        if (err) {
          throw err;
        }

        fs.writeFile("dist/js/" + f, "");
      });
    }
  });
});

gulp.task('i18n:clean', del.bind(null, ['dist/translations', 'dist/js/translations.js', 'dist/js/translations.min.js']));

gulp.task('i18n', function (cb) {
  runSequence('i18n:clean', ['i18n:build', 'i18n:exists'], cb);
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
//      .pipe($.imagemin({
//        progressive: true,
//        interlaced: true
//      }))
      .pipe(gulp.dest('dist/images'))
      .pipe($.size({title: 'images'}));
});

gulp.task("config", function () {
  var f = production ? "config.min.js" : "config.js";

  fs.readFile("app/config.js", "UTF-8", function (err, content) {
    if (err) {
      throw err;
    }

    $.git.exec({args: "rev-parse --short HEAD"}, function (err, stdout) {
      if (err) {
        throw err;
      }

      content = content.replace(/__VERSION__/g, packageJSON.version);
      content = content.replace(/__COMMIT__/g, stdout.replace(/[\r\n]/, ""));
      content = content.replace(/__API__/, env.api);
      content = content.replace(/__AUTH__/, env.auth);
      content = content.replace(/__PRODUCTION__/, production);
      content = content.replace(/__FAKE_AUTH__/, env.fake_auth);

      // Ensures path is in place, as I've had occurances where it may not be.
      mkdirp("dist/js", function (err) {
        if (err) {
          throw err;
        }

        fs.writeFileSync("dist/js/" + f, content);
      });
    });
  });
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
  return gulp.src(['app/fonts/**'])
      .pipe(gulp.dest('dist/fonts'))
      .pipe($.size({title: 'fonts'}));
});

// Copy External non Bower Libraries To Dist
gulp.task('vendor', function () {
  return gulp.src(['app/vendor/**'])
      .pipe(gulp.dest('dist/libs'))
      .pipe($.size({title: 'vendor'}));
});

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
  var f = production ? 'styles.min.css' : 'styles.css';

  return gulp.src('app/styles/app.less')
      .pipe($.changed('styles', {extension: '.less'}))
      .pipe($.less().on('error', $.util.log))
      .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
      .pipe($.concat(f))
      //.pipe($.if(production, $.csso()))
    // Concatenate And Minify Styles
      .pipe(gulp.dest('dist/css'))
      .pipe($.size({title: 'styles'}));
});

gulp.task('js:bower', function () {
  var stream = gulp.src(paths.bower);

  if (production) {
    var filter = $.filter('**/*.min.{js,css,map}');

    stream
        .pipe(filter)
        .pipe($.foreach(function (stream, file) {
          if (file.relative.indexOf(".js")) {
            var fileName = file.relative.substr(file.relative.lastIndexOf("/") + 1);
            fileName = fileName.substr(0, fileName.lastIndexOf(".min") + 4) + ".js.map";

            var path = file.relative.substr(0, file.relative.lastIndexOf("/") + 1) + fileName;
            return stream
                .pipe($.replace(fileName, "/libs/" + path));
          }

          return stream;
        }))
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
  var stream = gulp.src('dist/index.html');

  if (production) {
    var manifest = paths.vendor + "/rev-manifest.json";
    var vendorFiles = fs.existsSync(manifest) ? require(manifest) : [];
    var assets = $.useref.assets({searchPath: 'dist'});

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
        .pipe($.replace('d3-tip/index.min.js', 'd3-tip/index.js'))
        .pipe($.replace('moment/moment.min.js', 'moment/min/moment.min.js'))
        .pipe($.replace('analytics.min.js', 'analytics.js'))
        .pipe($.replace('FileSaver.min.min.js', 'FileSaver.min.js'))
        .pipe($.replace('.css', '.min.css'))
        .pipe($.replace('src/css/bootcards-desktop.min.css', 'src/css/bootcards-desktop.css'))
        .pipe($.replace('ngprogress-lite.min.css', 'ngprogress-lite.css'));
    // .pipe(
    // $.cdnizer({
    //   allowRev: true,
    //   allowMin: true,
    //   fallbackScript: "<script>function cdnizerLoad(u) {document.write('<scr'+'ipt src=\"'+u+'\"></scr'+'ipt>');}</script>",
    //   fallbackTest: '<script>if(typeof ${ test } === "undefined") cdnizerLoad("${ filepath }");</script>',
    //   files: [
    //     'google:angular',
    //     {
    //       cdn: 'cdnjs:lodash.js',
    //       package: 'lodash',
    //       test: '_'
    //     }
    //   ]}))
  }
  return stream
      .pipe($.replace('__BASE__', env.base))
      .pipe(gulp.dest('dist'))
      .pipe($.size({title: 'html'}));
});

// <tests>
gulp.task('test', ['clean', 'ts:compile', 'ng:templates'], function () {
  runSequence('karma:once')
});

gulp.task('plato', function () {
  return gulp.src('.tmp/scripts/**/*.js')
      .pipe($.plato('report'));
});

gulp.task('karma:once', function () {
  // Be sure to return the stream
  return gulp.src('app/scripts/*.js')
      .pipe($.karma({
        configFile: 'karma.conf.js',
        action: 'run'
      }))
      .on('error', function (err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
});

gulp.task('karma:watch', function () {
  return gulp.src('app/scripts/*.js')
      .pipe($.karma({
        configFile: 'karma.conf.js',
        action: 'watch'
      }));
});

gulp.task('webdriver', $.protractor.webdriver_update);

gulp.task('protractor', ['webdriver'], function () {
  return gulp.src('app/tests/**/*.spec.js')
      .pipe($.protractor.protractor({configFile: 'protractor.conf.js'}));
});
// </tests>

// <typescript>
//gulp.task('ts:lint', function () {
//  return gulp.src('app/scripts/**/*.ts')
//      .pipe($.tslint())
//      .pipe($.tslint.report('prose', {emitError: true}));
//});

var tsProject = $.typescript.createProject({
    "target": "es6",
		"module": "commonjs",
		"sortOutput": true,
		"declarationFiles": true,
		"noExternalResolve": false
});

gulp.task('ts:compile', function () {
  var f = production ? 'app.min.js' : 'app.js';
  var tsResult = gulp.src('app/**/*.ts')

      .pipe($.typescript(tsProject));

  tsResult.dts.pipe(gulp.dest('dist/dts'));
  tsResult.js.pipe(gulp.dest('.tmp'));

  return tsResult.js
      .pipe($.sourcemaps.init())
      .pipe($.concat(f))
      .pipe($.ngAnnotate())
      .pipe($.if(production, $.uglify()))
      .pipe($.wrap({src: './iife.txt'}))
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
gulp.task('serve:web', function (cb) {
  var bsOpts = {
    open: false,
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
    },
    port: env.port,
    host: "gdc-portal.nci.nih.gov"
//    open: "external"
  };
//    bsOpts.tunnel = production ? 'oicrgdcdev' : false;

  browserSync(bsOpts);

  if (!production) {
    gulp.watch(['app/**/*.html'], ['html', reload]);
    gulp.watch(['app/**/*.{less,css}'], ['styles', reload]);
    gulp.watch(['app/scripts/**/*.ts'], ['ts:compile', reload]);
    gulp.watch(['app/scripts/**/*.html'], ['ng:templates', reload]);
    gulp.watch(['app/images/**/*'], ['images', reload]);
  }
});

gulp.task('pegjs', function () {
  var PEG = require('pegjs');
  var input = fs.readFileSync("gql.pegjs", {encoding: 'utf8'});
  var parser = PEG.buildParser(input, {output: "source"});
  mkdirp("dist/js", function (err) {
    if (err) {
      throw err;
    }
    var out = production ? "dist/js/gql.min.js" : "dist/js/gql.js";
    fs.writeFileSync(out, "window.gql = " + parser);
    if (production) {
      gulp.src(out)
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe($.size({title: 'GQL'}));
    }

  });
});

gulp.task('serve', function (cb) {
  runSequence('default', ['karma:watch',
   'serve:web'], cb);
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['rev', 'images', 'fonts', 'vendor', 'ts:compile', 'i18n', 'config', 'pegjs'], cb);
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
