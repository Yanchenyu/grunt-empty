'use strict';

module.exports= function(grunt){
	// require('load-grunt-tasks')(grunt);

	require('time-grunt')(grunt);

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.registerTask('default', ['imagemin']);
	// grunt.loadNpmTasks('grunt-contrib-watch');

	



	grunt.initConfig({

		// watch: {
		// 	main:{
		// 		files:'app/*'
		// 	}
		// }
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			main: {
				// expend: true,

				// cwd: 'app',

				// // src: '<%= config.app %>/index.html',

				// // dest: '<%= config.dist %>/index.html'
				// src: ['**'],
				// dest: 'dist'
				files:[
					// {expand: true,cwd: 'app', src: ['**'], dest: 'dest/', filter: 'isFile'},
					{expand: true, src: 'app/*',dest:'dest/', filter: 'isFile'}
				]
			}
		},

		clean: {
			build: {
				// src: '<%= config.dist %>/index.html'
				// files:[{src: 'dest/app_2'},{src:'dest/index.html'}]
				src: ['output']
			}
		},

		uglify: {
		
				options: {
                	banner: '/*! 包名：<%= pkg.name %> - 版本号v：<%= pkg.version %> */\n', 
                			
        			footer:	'\n/*! 修改日期：<%= grunt.template.today("yyyy-mm-dd") %> */',
        			preserveComments: false
            	},
            	my_target: {
					// files: {
					// 	'js/index.min.js' : ['js/index.js','js/other.js']
					// },

					files: [{
	                    expand:true,
	                    cwd:'js',//js目录下
	                    src:'**/*.js',//所有js文件
	                    dest: 'output/js'//输出到此目录下
                	}]
				}

		
					
			

		},

		imagemin: {                          // Task
	    static: {                          // Target
	      options: {                       // Target options
	        optimizationLevel: 7,			//图片优化等级
	        // svgoPlugins: [{ removeViewBox: false }],
	        // use: [mozjpeg()]
	      },
	      files: {                         // Dictionary of files
	        'dist/img.png': 'src/mygirl.png', // 'destination': 'source'
	        
	      }
	    },
	    dynamic: {                         // Another target
	      files: [{
	        expand: true,                  // Enable dynamic expansion
	        cwd: 'src/',                   // Src matches are relative to this path
	        src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
	        dest: 'dist/'                  // Destination path prefix
	      }]
	    }
	  },









	})
}