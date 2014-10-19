'use strict';
// var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var component = require('./bower.json'),
    version = component.version;

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist',
    appVersion: version
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    clean: {
      gen: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/scripts',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp',
      dist: '<%= yeoman.dist %>'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        'test/spec/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      ci: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      },
      watch: {
        configFile: 'karma.conf.js',
        autoWatch: true
      }
    },
    concat: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '.tmp/scripts/{,*/}*.js',
            '<%= yeoman.app %>/scripts/{,*/}*.js'
          ]
        }
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/webcam.min.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ],
        }
      }
    }
  });

  grunt.registerTask('test', [
    'jshint',
    'clean:server',
    'connect:test',
    'karma:unit'
  ]);

  grunt.registerTask('ci', [
    'jshint',
    'clean:server',
    'connect:test',
    'karma:ci'
  ]);

  grunt.registerTask('watch', [
    'clean:server',
    'connect:test',
    'karma:watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'clean:gen',
    'test',
    'concat',
    'uglify',
    'clean:gen',
  ]);

  grunt.registerTask('default', ['test']);
};
