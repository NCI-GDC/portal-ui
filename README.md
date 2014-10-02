`Buzzwords: #typescript #angularjs #immutablejs #gulp #less #bower #selenium`

# Technologies

- [Typescript](http://www.typescriptlang.org/) - TypeScript lets you write JavaScript the way you really want to.
- [Angular](https://angularjs.org/) - HTML enhanced for web apps
- [AngularUI](http://angular-ui.github.io/) - The companion suite(s) to the AngularJS framework.
- [ImmutableJS](https://github.com/facebook/immutable-js) - Immutable Data Collections for Javascript
- [Gulp.js](http://gulpjs.com/) - The streaming build system
- [Karma](http://karma-runner.github.io/0.12/index.html) - Spectacular Test Runner for Javascript
- [Protractor](https://github.com/angular/protractor) - E2E test framework for Angular apps
- [Less](http://learnboost.github.io/stylus/)

# Setup

###Git hook

Git commit-msg hook is based on Angular's [Guidelines](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)

- Create a git commit message hook file

```
mv .git/hooks/commit-msg.sample .git/hooks/commit-msg
```

- Edit `.git/hooks/commit-msg`

```
#!/bin/sh

exec < /dev/tty
git_hooks/validate-commit.py $1
```
- Make sure `git_hooks/validate-commit.py` is executable

```
chmod 755 git_hooks/validate-commit.py
```

### Dependences

The project is setup to use Bower and NPM

```
> npm install
> npm run bower
```

Tests
=

Unit tests are run using Karma

```
> npm test
...
```



Browser tests are run with Protractor

```
> npm run browsertest
...

Starting selenium server in parallel mode... started - PID:  11996


```

Development
=

The development server is setup using Browsersync

```
> npm start
Environment Development
...
[BS] Local URL: http://localhost:3000
[BS] External URL: http://192.168.1.42:3000
[BS] Serving files from: dist
```

Production
=

Gulp bundles all the assets in production mode and creates unique file names for caching

```
> npm dist
...
Found 3 matching tests...
...
Environment Production
...
Starting selenium server in parallel mode...
...
> cd dist
> python -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000
...
> open http://localhost:8000/
```

Resources
=

- [angularjs-via-typescript-controllers](http://kodeyak.wordpress.com/2014/02/12/angularjs-via-typescript-controllers/)
- [AngularJS + TypeScript : Controllers, Best Practice](https://www.youtube.com/watch?v=WdtVn_8K17E)
- [Angular Services using TypeScript : Best Practices](https://www.youtube.com/watch?v=Yis8m3BdnEM)