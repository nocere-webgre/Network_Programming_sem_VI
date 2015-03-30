module.exports = function(grunt) {
    var staticPath = '../';

    grunt.initConfig({
        staticPath: staticPath,
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            app: {
                options: {
                    // Replace all 'use strict' statements in the code with a single one at the top
                    banner: "(function($){"+
                    "  'use strict';" +
                    " ",
                    footer: "}(jQuery));"
                },
                src: [ '<%= staticPath  %>dev/js/*.js' ],
                dest: '<%= staticPath  %>static/scripts/app.js'
            },

            libs: {
                options: {
                },
                src: [
                    '<%= staticPath  %>dev/js/libs/*.js',
                    '<%= staticPath  %>static/scripts/app.js'
                ],
                dest: '<%= staticPath  %>static/scripts/app.js'
            }
        },

        libsass: {
            options: {
                sourcemap: false,
                style: 'expanded'
            },
            files: {
                src: '<%= staticPath  %>dev/scss/style.scss',
                dest: '<%= staticPath  %>static/styles/style.css'
            }
        },

        sprite:{
            all: {
                src: '<%= staticPath  %>dev/sprite/*.png',
                dest: '<%= staticPath  %>static/images/sprite.png',
                imgPath: '/static/images/sprite.png',
                destCss: '<%= staticPath  %>dev/scss/_sprite.scss'
            }
        },

        uglify: {
            options: {
                mangle: false,//nie zmienia nazw zmiennych
                preserveComments: true, //usuwa komentarze
                compress: {
                    drop_console: true//wyrzuca wszystkie console.*
                }
            },
            app: {
                src: '<%= staticPath  %>static/js/app.js',
                dest: '<%= staticPath  %>static/js/script.js'
            }
        },

        watch: {
            options: {
                spawn: false,
                debounceDelay: 150,
                atBegin: true
            },
            sass: {
                files: ['<%= staticPath  %>dev/scss/*.scss', '<%= staticPath  %>dev/scss/*/*.scss'],
                tasks: 'buildSass'
            },
            js: {
                files: ['<%= staticPath  %>dev/js/*.js', '<%= staticPath  %>dev/js/libs/*.js'],
                tasks: ['buildJS']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-libsass');

    grunt.registerTask( 'buildJS', [
        'concat:app',
        'concat:libs'
        //'uglify'
    ] );

    grunt.registerTask('buildSass', [
        'libsass'
    ]);

    grunt.registerTask('buildSprite', [
        'sprite'
    ]);

    grunt.registerTask('watchJS', [
        'watch:js'
    ]);

    grunt.registerTask('watchSass', [
        'watch:sass'
    ]);

};