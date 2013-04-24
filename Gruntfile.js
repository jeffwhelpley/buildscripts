/**
  * Grunt Configuration File for GetHuman
  *
  * This build script is vital to running the gh app. You must run
  * it after any javascript or css change and should be run in watch
  * mode during development. See this URL for more info on Grunt:
  *
  * https://github.com/cowboy/grunt/blob/master/docs/configuring.md
  *
  */
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        // this is used to version the primary JS and CSS files generated
        timestamp: grunt.template.today('yyyymmddhhMMss'),

        // get the checkin message from the command line (prod deployments only)
        checkinMessage: grunt.option('m') || 'Auto checkin from grunt script',

        // the build directory is a temp dir used to compile js and less
        // the dist folder is essentially what should be deployed
        //      NOTE: the dist folder is referenced in dev by the server
        // the clean task here is run first to simply clear out these directories
        clean: {

            options: {
                force: true
            },

            build: {
                src: ["build"]
            },

            dist: {
                src: ["../dist"]
            },

            img: {
                src: ["../dist/img"]
            }

        },

        // we need to make sure our js code always adheres to script jshint standards
        jshint: {
            options: {
                curly:      true,
                eqeqeq:     true,
                immed:      true,
                latedef:    true,
                newcap:     true,
                noarg:      true,
                sub:        true,
                undef:      true,
                boss:       true,
                eqnull:     true,
                browser:    true,
                globals: {
                    angular:    true,
                    jQuery:     true
                }
            },
            uses_defaults: [
                '../client/gh.app.js',
                '../client/controllers/**/*.js',
                '../client/directives/**/*.js',
                '../client/filters/**/*.js',
                '../client/models/**/*.js',
                '../client/routes/**/*.js',
                '../client/services/**/*.js',
                '../client/wrappers/**/*.js'
            ]
        },

        // for non-dev environments, minify all our custom code
        uglify: {

            // change this if we have issue with function/variable renaming
            options: {
                mangle: true
            },

            all: {
                files: {
                    // minify our custom js files (no order for now)
                    'build/client/ngcustom.js': [
                        '../client/gh.app.js', // make sure gh.app first
                        '../client/controllers/**/*.js',
                        '../client/directives/**/*.js',
                        '../client/filters/**/*.js',
                        '../client/models/**/*.js',
                        '../client/routes/**/*.js',
                        '../client/services/**/*.js',
                        '../client/wrappers/**/*.js'
                    ]
                }
            }
        },

        copy: {

            // this is just used when uglify is not called in order to get js files into build
            js: {
                files: [
                    {
                        expand: true,
                        cwd: '../client/',
                        src: [
                            'gh.app.js',
                            'controllers/*.js',
                            'directives/*.js',
                            'filters/*.js',
                            'models/*.js',
                            'routes/*.js',
                            'services/*.js',
                            'wrappers/*.js'
                        ],
                        dest: 'build/client/'
                    }
                ]
            },

            // modernizr copied (one off from the server side)
            jslib: {
                files: [
                    {
                        expand: true,
                        cwd: 'jslibs',
                        src: ['modernizr.min.js'],
                        dest: '../dist/js/libs/'
                    },
                    {
                        expand: true,
                        cwd: 'components/jquery',
                        src: ['jquery.min.js'],
                        dest: '../dist/js/libs/'
                    },
                    {
                        expand: true,
                        cwd: 'components/angular',
                        src: ['angular.min.js'],
                        dest: '../dist/js/libs/'
                    }
                ]
            },

            csslib : {
                files: [
                    {
                        expand: true,
                        cwd: 'csslibs',
                        src: ['**/*.css'],
                        dest: '../dist/css/libs/'
                    }
                ]
            },

            img: {
                files: [{
                    expand: true,
                    cwd: '../images/',
                    src: ['**/*.ico', '**/*.gif'],
                    dest: '../dist/img/'
                }]
            }
        },

        // concat all the javascript files into one JS file
        concat: {
            js: {
                src:[

                    // concat bootstrap js to list
                    'jslibs/bootstrap.min.js',

                    // add humane.js
                    'components/humane-js/humane.min.js',

                    // finally add our custom javascript code
                    'build/client/**/*.js'
                ],

                // this is the final output dir that has our one combined js file
                dest: '../dist/js/gh.<%= timestamp %>.js'
            },

            jsdev: {
                src: [

                    // concat bootstrap js to list
                    'jslibs/bootstrap.min.js',

                    // add humane.js
                    'components/humane-js/humane.min.js',

                    // ensure that gh.app module definition first
                    'build/client/gh.app.js',

                    // finally add our custom javascript code
                    'build/client/*/**/*.js'
                ],

                // this is the final output dir that has our one combined js file
                dest: '../dist/js/gh.<%= timestamp %>.js'
            }
        },

        // convert less to css and do a yui compress
        less: {
            all: {
                files: {
                    '../dist/css/gh.<%= timestamp %>.css': [
                        '../server/templates/**/*.less',
                        'components/humane-js/themes/jackedup.css'
                    ]
                },
                options: {
                    yuicompress: true
                }
            }
        },

        // this is to optimize the images that we are using
        imagemin: {

            dist: {
                options: {
                    optimizationLevel: 3
                },
                files: {
                    '../dist/img': [
                        '../images/**/*.png',
                        '../images/**/*.jpg',
                        '../images/**/*.jpeg',
                        '../images/**/*.PNG',
                        '../images/**/*.JPG',
                        '../images/**/*.JPEG'
                    ]
                }
            }

        },

        // re-run tasks whenever files change
        watch: {

            resources: {
                files: [
                    '../server/template/**/*.less',
                    '../client/**/*.js'
                ],
                tasks: ['dev']
            }

        },

        // update client and server config files
        replace: {
            server: {
                src: ['../server/gethuman/settings/base.py'],
                overwrite: true,
                replacements: [{
                    from: /STATIC_VERSION = '.*'/g,
                    to: "STATIC_VERSION = '<%= timestamp %>'"
                }]
            }
        },

        // move /dist folder contents to /assets on CDN
        cloudfiles: {
            prod: {
                'user': 'gethumanllc',
                'key': process.env.CDN_API_KEY,
                'upload': [{
                    'container': 'assets',
                    'src': '../dist/**/*',
                    'dest': '',
                    'stripcomponents': 2
                }]
            }
        },

        // record the script start time
        startTime: new Date(),

        // get the end time minus the start time
        getRuntime: function() {
            var endTime = new Date();
            return endTime.getTime() - this.startTime.getTime();
        },

        // shell commands
        shell: {
            deploy: {
                command: 'deployscript "<%= checkinMessage %>"',
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            displayRuntime: {
                command: 'echo "Version <%= timestamp %> deployed to Heroku in <%= getRuntime() %> milliseconds"',
                options: {
                    stdout: true,
                    stderr: true
                }
            },
            testweb: {
                command: 'testweb',
                options: {
                    stdout: true,
                    stderr: true
                }
            }
        },

        karma: {
            unit: {
                configFile: '../client/test/config/karma.unit.config.js'
            },
            midway: {
                configFile: '../client/test/config/karma.midway.config.js'
            },
            e2e: {
                configFile: '../client/test/config/karma.e2e.config.js'
            }
        }
    });

    // register the different grunt libraries
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-cloudfiles');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('temp', ['shell:cdBack', 'shell:lsCurrent']);

    // move images over to dist
    grunt.registerTask('img', ['clean:img', 'imagemin', 'copy:img']);

    // this is just an alias for convenience when moving files to CDN
    grunt.registerTask('cdn', ['cloudfiles']);

    // this is just an alias for convenience when moving files to CDN
    grunt.registerTask('test', ['shell:testweb', 'karma:unit']);

    // this is just an alias for shell to something more recognizable
    grunt.registerTask('heroku', ['shell:deploy']);

    // during development, this is what we use so that the JS is concated without being minified
    grunt.registerTask('default', [
        'jshint',
        'clean:build',
        'replace',
        'copy:js',
        'concat:jsdev',
        'copy:jslib',
        'less',
        'copy:csslib',
        'img',
        //'test',
        'clean:build'
    ]);

    grunt.registerTask('dev', [
        'jshint',
        'clean:build',
        'replace',
        'copy:js',
        'concat:jsdev',
        'copy:jslib',
        'less',
        'copy:csslib',
        //'test',
        'clean:build'
    ]);

    // doing a prod deployment
    grunt.registerTask('prod', [
        'jshint',
        'clean',
        'replace',
        'uglify',
        'concat:js',
        'copy:jslib',
        'less',
        'copy:csslib',
        'img',
        //'test',
        'cdn',
        'shell:deploy',
        'clean:build',
        'shell:displayRuntime'
    ]);
};
