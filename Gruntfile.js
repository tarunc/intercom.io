/*
 * Gruntfile.js
 */

'use strict';

// intercom.io uses `[grunt](http://gruntjs.com)` to define and run repetitive tasks
// such as minification, compilation, unit testing, linting, etc.
var path = require('path');

// ## Grunt configuration.
// @export `ConfigureGruntService` a function which configures tasks to be run with
// `grunt`
module.exports = function ConfigureGruntService(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Provide some basic configuration for grunt
  grunt.initConfig({
    // Read in the package.json to get access to the variables defined in there
    pkg: grunt.file.readJSON('package.json'),
    // Define the Docker task to generate documentation from our codebase.
    docker: {
      app: {
        expand: true,
        src: ['lib/*.js'],
        dest: 'docs/',
        options: {
          onlyUpdated: false,
          colourScheme: 'default',
          ignoreHidden: false,
          sidebarState: false,
          exclude: false,
          lineNums: true,
          multiLineOnly: false,
          extras: ['fileSearch', 'goToLine']
        }
      }
    },
    // Define the various shell tasks
    shell: {
      // Define a `sweetenDocker` command which sweetens the output from docker
      sweetenDocker: {
        command: 'bin/sweeten-docker ./docs/lib',
        stdout: true,
        stderr: true,
        failOnError: true
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      files: {
        src: ['lib/*.js', 'index.js', 'Gruntfile.js']
      }
    },
    'gh-pages': {
      options: {
        base: 'docs',
        push: true,
        message: 'Auto-generated commit'
      },
      src: '**/*'
    },
    copy: {
      docs: {
        files: [{
          src: 'docs/intercom.io.js.html',
          dest: 'docs/index.html'
        }]
      }
    },
    'string-replace': {
      docs: {
        files: [{
          expand: true,
          cwd: 'docs/lib/',
          src: '*',
          dest: 'docs/'
        }],
        options: {
          replacements: [{
            pattern: /\.\.\//g,
            replacement: './'
          }]
        }
      }
    }
  });

  // ## Define the tasks
  // ### Default task(s).
  // Just running `grunt` will load the default tasks.
  // For now, the only default tasks are `jshint:app`
  grunt.registerTask('default', ['jshint']);

  // ### Doc task(s).
  // Running `grunt doc` will generate documentation for intercom.io.
  // The documentation will be put into the `./docs` folder in project's root
  // folder.
  grunt.registerTask('doc', ['docker:app', 'shell:sweetenDocker', 'string-replace:docs', 'copy:docs']);
  // @note `grunt docs` provides an alias for the `grunt doc` task
  grunt.registerTask('docs', ['doc']);
};
