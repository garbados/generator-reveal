// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var path = require('path');
var mountFolder = function (connect, dir) {
    return connect.static(path.resolve(dir));
};
var config = require('./config.json');

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        watch: {
            options: {
                nospawn: true,
                livereload: LIVERELOAD_PORT
            },
            livereload: {
                files: [
                    'index.html',
                    'js/*.js',
                    'slides/*.md',
                    'slides/*.html',
                    'slides/list.json'
                ],
                tasks: ['build']
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%%= connect.options.port %>'
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        src: [
                            'bower_components/**', 
                            'slides/**', 
                            'js/**',
                            'images/**',
                            'index.html'
                        ], 
                        dest: '_attachments/'
                    },
                    {
                        expand: true,
                        src: [
                            'css/**'
                        ],
                        dest: '_attachments/bower_components/reveal.js/css/'
                    }
                ]
            }
        },
        mkcouchdb: {
            app: {
                db: [config.couchapp.root, config.couchapp.db].join('/'),
                options: {
                    okay_if_exists: true
                }
            }
        },
        couchapp: {
            app: {
                db: [config.couchapp.root, config.couchapp.db].join('/'),
                app: config.couchapp.app
            }
        }
    });

    grunt.registerTask('server', ['build', 'connect:livereload', 'open', 'watch']);

    grunt.registerTask('build', 'Build your slides.', function () {
        var slides = [];

        grunt.file.recurse('slides', function (post, root, sub, fileName) {
            if (fileName === 'index.md') {
                return;
            }
        });
    });

    grunt.registerTask('default', ['build', 'mkcouchdb', 'copy', 'couchapp'])
};
