module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		jshint : {
			options : {
				reporter : require('jshint-stylish'),
				devel : true,
				predef : ['document'],
			},
			debug : ['Gruntfile.js', 'debug/js/**/*.js']
		},
		concat : {
			debug:{
				files: {
					'debug/js/core.js' : ['src/js/core/events.js', 'src/js/core/types.js', 'src/js/core/**/*.js'],
					'debug/js/ui.js' : ['src/js/ui/*.js', 'src/js/ui/**/*.js'],
					'debug/css/chandler.css' : ['src/css/**/*.css']
				}
			}
		},
		copy : {
			debug : {
				files: [
					{expand: true, cwd: 'src/', src : './**/*.html', dest : 'debug/'},
					{expand: true, cwd: 'src/js', src: './*.js', dest: 'debug/js/'}
				],
			}
		},
		postcss : {
			options:{
				map: {
					inline: false
				},
				proccessors: [
					require('autoprefixer')(),
					require('stylelint')()
				],
			},
			debug: {
				src: 'debug/css/**/*.css'
			}
		},
		clean: {
			debug: {
				src: ['debug/*']
			}
		},
		watch: {
			debug: {
				files: ['src/**/*'],
				tasks: ['debug'],
			}
		}
	});

	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('debug', ['clean:debug', 'jshint:debug', 'concat:debug', 'copy:debug', 'postcss:debug']);
	grunt.registerTask('default', ['debug']);

};
