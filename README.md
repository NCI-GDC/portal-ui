`Buzzwords: #typescript #angularjs #immutablejs #gulp #less #bower #selenium #karma #protractor`

[![Build Status](https://magnum.travis-ci.com/NCI-GDC/portal-ui.svg?token=uvYjzX9Pbq2o3AVCP1S4&branch=master)](https://magnum.travis-ci.com/NCI-GDC/portal-ui)

- [Technologies](#technologies)
- [Installation](#installation)
- [Tests](#tests)
- [Development](#development)
- [Contributing](#contributing)
- [Production](#production)
- [Verifying Tags](#verify)
- [Resources](#resources)

# Technologies

- [Typescript](http://www.typescriptlang.org/) - TypeScript lets you write JavaScript the way you really want to.
- [Angular](https://angularjs.org/) - HTML enhanced for web apps
- [AngularUI](http://angular-ui.github.io/) - The companion suite(s) to the AngularJS framework.
- [ImmutableJS](https://github.com/facebook/immutable-js) - Immutable Data Collections for Javascript
- [Gulp.js](http://gulpjs.com/) - The streaming build system
- [Karma](http://karma-runner.github.io/0.12/index.html) - Spectacular Test Runner for Javascript
- [Protractor](https://github.com/angular/protractor) - E2E test framework for Angular apps
- [Less](http://learnboost.github.io/stylus/)

# Installation

## Global Dependencies

Before continuing you must have the following programs installed:

- [Node](http://nodejs.org/)

## Setup Script

Running the setup script will:

1. Setup the needed git hook for the project
2. Install npm and bower dependencies

```
❯ ./setup.sh
commit-msg already exists! Backing up to commit-msg.bak...  OK
Setting up commit-msg git hook...                           OK
Making commit-msg executable...                             OK
Making validate-commit.py executable...                     OK
Confirming Node is installed...                             OK
Installing NPM dependencies...
...
Setup Successful!

```

### Running Locally
#### Remote API & ElasticSearch, Local UI
Connect to VPN and run ui with
```
GDC_API=https://gdc-portal.nci.nih.gov/auth/api/v0 GDC_FAKE_AUTH=true npm start
```

#### Local API, Remote ElastiSearch and Local UI
Connect to VPN and run api with
```
GDC_ES_INDEX=gdc_from_graph GDC_ES_HOST=ip GDC_ES_USER=user GDC_ES_PASS=pw GDC_PORTAL_ENDPOINT=http://localhost:3000 GDC_FAKE_DOWNLOAD=True python run.py
```
ES creds can be found on any API machine in `/var/www/gdcapi/gdcapi.wsgi`

UI can simply be run as usual with
```
npm start
```

#### Local API, ElasticSearch and UI
Not recommended, would require loading local ES with data.

### Authentication
In order to properly run the UI and login to test the auth you will need to run the application
in a specific way. This includes `sudo` and running the app on port `80`. You will need to ensure
that you don't have something else using that port (like a local apache setup).

The following command should work:
`sudo GDC_API=http://portal.gdc.nci.nih.gov:5000 GDC_PORT=80 npm start`

#### Modifying /etc/hosts
In order to support local use of the login system we need to add the following
to your `/etc/hosts` file:

`127.0.0.1 gdc-portal.nci.nih.gov`

### ElasticSearch
If you are connecting to a local ES, edit path-to-elastic-search/config/elasticsearch.yml, find the line with http.max_content_length, add
```
http.max_initial_line_length: 1000mb
```
to increase the max length of a HTTP URL

### Git hooks

Git commit-msg hook is based on Angular's [Guidelines](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#)

The git hooks can be found in `git_hooks/`

### Project Dependencies

Project dependencies are managed using [Bower](http://bower.io/) and [NPM](https://www.npmjs.org/)

# Tests

Unit tests are run using Karma

```
❯ npm test
...
[16:44:06] Starting Karma server...
WARN [karma]: Port 9876 in use
INFO [karma]: Karma v0.12.24 server started at http://localhost:9877/
INFO [launcher]: Starting browser PhantomJS
INFO [PhantomJS 1.9.7 (Mac OS X)]: Connected on socket m-mK9_Udpg1Jb226Ws3o with id 36984552
...
Finished in 0.014 secs / 0.001 secs
```

Browser tests are run with Protractor

```
❯ npm run prot
...
[16:34:28] Starting 'webdriver'...
selenium standalone is up to date.
chromedriver is up to date.
[16:34:28] Finished 'webdriver' after 199 ms
[16:34:28] Starting 'protractor'...
Using ChromeDriver directly...
...
[16:34:32] Finished 'protractor' after 4.23 s

```

# Development

The development server is setup using Browsersync

```
❯ GDC_API="http://gdc-portal.nci.nih.gov:5000" npm start
[16:47:02] Environment Development
...
[BS] Local URL: http://localhost:3000
[BS] External URL: http://gdc-portal.nci.nih.gov:3000
[BS] Serving files from: dist
```

# Contributing

Read how to contribute [here](https://github.com/NCI-GDC/portal-ui/blob/master/CONTRIBUTING.md)

# Production

Gulp bundles all the assets in production mode and creates unique file names for caching

```
❯ npm dist
...
Found 3 matching tests...
...
Environment Production
...
Starting selenium server in parallel mode...
...
❯ cd dist
❯ python -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000
...
❯ open http://localhost:8000/
```

# Verifying Tags

```
❯ git show maintainer-pgp-pub | gpg --import
❯ git tag --verify [signed-tag-name]
```

# Resources

- [angularjs-via-typescript-controllers](http://kodeyak.wordpress.com/2014/02/12/angularjs-via-typescript-controllers/)
- [AngularJS + TypeScript : Controllers, Best Practice](https://www.youtube.com/watch?v=WdtVn_8K17E)
- [Angular Services using TypeScript : Best Practices](https://www.youtube.com/watch?v=Yis8m3BdnEM)
