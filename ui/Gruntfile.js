/* jshint node: true */
module.exports = function (grunt) {
  var path = require('path');
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var projectConfig = {
    app: 'app',
    dist: 'dist',
    tmp: '.tmp',
    port: 3333
  };

  grunt.initConfig({
    project: projectConfig,
    watch: {
      less: {
        files: ['<%= project.app %>/styles/**/*.less'],
        tasks: ['less:server'],
        options: {
          atBegin: true
        }
      },
      livereload: {
        files: [
          '{<%= project.tmp %>,<%= project.app %>}/**/*.html',
          '{<%= project.tmp %>,<%= project.app %>}/styles/**/*.css',
          '{<%= project.tmp %>,<%= project.app %>}/scripts/**/*.js'
        ],
        options: {
          livereload: true
        }
      },
    },
    env: {
      livereload: {
        PORT: projectConfig.port,
        NODE_ENV: 'development'
      },
      dist: {
        NODE_ENV: 'production',
        VERSION: '<%= revision %>',
      },
    },
    preprocess: {
      dist: {
        src: '<%= project.app %>/index.html',
        dest: '<%= project.dist %>/index.html'
      }
    },
    connect: {
      server: {
        options: {
          port: '<%= process.env.PORT || project.port %>',
          debug: true,
          middleware: function (connect) {
            var swagger = connect();
            swagger.use('/docs', connect.static(path.resolve(projectConfig.app + '/components/swagger-ui/dist')));
            return [
              require('grunt-connect-proxy/lib/utils').proxyRequest,
              connect.static(path.resolve(projectConfig.tmp)),
              connect.static(path.resolve(projectConfig.app)),
              swagger,
            ];
          }
        },
        proxies: [{
          context: '/api',
          host: 'localhost',
          port: 8080,
        }]
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= project.dist %>/*',
            '!<%= project.dist %>/.placeholder',
          ]
        }]
      },
      server: '<%= project.tmp %>'
    },
    less: {
      options: {
        paths: [
          '<%= project.app %>/styles',
          '<%= project.app %>/components'
        ]
      },
      server: {
        files: {
          '<%= project.tmp %>/styles/main.css': '<%= project.app %>/styles/main.less'
        }
      },
      dist: {
        files: [{
          '<%= project.dist %>/styles/main.css': '<%= project.app %>/styles/main.less'
        }],
        options: {
          sourceMap: true,
          sourceMapFilename: '<%= project.dist %>/styles/main.map',
          sourceMapURL: 'main.map',
          outputSourceFiles: true,
          compress: true,
        },
      }
    },
    useminPrepare: {
      html: '<%= project.dist %>/index.html',
      options: {
        root: '<%= project.app %>',
        dest: '<%= project.dist %>',
        flow: {
          steps: {
            js: [{
              name: 'uglify',
              createConfig: function(context, block) {
                var cfg = {files:[]};
                context.outFiles = [];

                var files = {};
                var ofile = path.join(context.outDir, block.dest);
                files.dest = ofile;
                files.src = context.inFiles.map(function(fname) { return path.join(context.inDir, fname);});
                cfg.files.push(files);
                context.outFiles.push(block.dest);
                return cfg;
              },
            }],
          },
          post: [],
        },
      }
    },
    uglify: {
      options: {
        // Because we are not using strict-di...
        mangle: false,
        report: 'min',
        sourceMap: true,
        sourceMapIncludeSources: true,
      }
    },
    usemin: {
      html: ['<%= project.dist %>/**/*.html'],
      css: ['<%= project.dist %>/styles/**/*.css'],
      options: {
        dirs: ['<%= project.dist %>']
      }
    },
    htmlmin: {
      dist: {
        options: {
        },
        files: [{
          expand: true,
          cwd: '<%= project.app %>',
          src: [
            '*.html',
            '!index.html', // Preprocess handles index.html
            'docs/*.html',
            'views/**/*.html'
          ],
          dest: '<%= project.dist %>'
        }, {
          // Htmlmin preprocessed index.html in-place
          expand: true,
          cwd: '<%= project.dist %>',
          src: ['index.html'],
          dest: '<%= project.dist %>'
        }]
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= project.dist %>/scripts/{vendor,scripts}.js',
            '<%= project.dist %>/styles/{,*/}*.css',
            '<%= project.dist %>/components/bootstrap/dist/fonts/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= project.app %>',
          dest: '<%= project.dist %>',
          src: [
            'docs/*',
            '!docs/index.html',
            '*.{txt}',
            '.htaccess',           
            'components/bootstrap/dist/fonts/*',
            
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= project.app %>/components/swagger-ui/dist',
          dest: '<%= project.dist %>/docs',
          src: [
            '**/*',
            '!index.html'
          ],
        }]
      }
    },
    'git-describe': { // Task needs to have a target
      'build': {
      }
    },
  });

  grunt.registerTask('server', [
    'env:livereload',
    'clean:server',
    'less:server',
    'configureProxies:server',
    'connect:server',
    'watch'
  ]);

  grunt.registerTask('set-build-version', function() {
    grunt.event.once('git-describe', function(rev) {
      grunt.config('revision', '' + new Date() + ' (' + rev + ')');
    });
    grunt.task.run('git-describe');
  });

  grunt.registerTask('build', [
    'set-build-version',
    'env:dist',
    'clean:dist',
    'less:dist',
    'preprocess',
    'useminPrepare',
    'htmlmin',
    'copy:dist',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', ['build']);
};

