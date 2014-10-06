exports.config = {
    // The file path to the selenium server jar.
    seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.43.1.jar',
    chromeOnly: true,
    capabilities: {
        browserName: 'chrome'
    },

    specs: ['app/tests/**/*.spec.js'],
    baseUrl: 'http://localhost:3000',
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        reporter: 'list',
        enableTimeouts: false
    }
};
