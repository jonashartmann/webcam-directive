module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/webcam.js',
      'test/**/*[sS]pec.js'
    ],

    preprocessors: {
      'src/**/*.js': ['rollup'],
      'test/**/*[sS]pec.js': ['rollup']
    },

    rollupPreprocessor: {
      plugins: [
        require('@rollup/plugin-node-resolve').default(),
        require('@rollup/plugin-commonjs').default(),
        require('@rollup/plugin-babel').default({
          babelHelpers: 'bundled',
          presets: [
            ['@babel/preset-env', { targets: { browsers: 'ie 11' } }]
          ]
        })
      ],

      external: [
        'angular',
        'angular-mocks'
      ],

      output: {
        format: 'iife',
        name: 'webcamDirectiveTest',
        globals: {
          angular: 'angular'
        },
        sourcemap: 'inline'
      }
    },

    reporters: ['progress'],
    browsers: ['ChromiumHeadlessNoGPU'],

    customLaunchers: {
      ChromiumHeadlessNoGPU: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer'
        ],
        chromeDataDir: '/tmp/chrome'
      }
    },
    singleRun: true,
    autoWatch: false
  });
};
