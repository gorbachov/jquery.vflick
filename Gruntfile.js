/*global module:false*/
module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*! \n' + 
						' * [<%= pkg.name %>]\n' + 
						' * <%= pkg.description %>\n' + 
						' * \n' + 
						' * @version <%= pkg.version %>\n' +
						' * @url \n' +
						' * \n' + 
						' * Copyright <%= pkg.author %>\n' +
						' * Licensed under the <%= pkg.license %> License\n' +
						'*/\n',
		uglify:{
			main:{
				src: '<%= pkg.name %>.js',
				dest: '<%= pkg.name %>.min.js'
			},
			example:{
				src: '<%= pkg.name %>.js',
				dest: 'example/js/<%= pkg.name %>.min.js'
			},
			options:{
				banner: '<%= banner %>',
				mangle:false,
				compress:true
			}
		},
		jshint:{
			all:[
				'Gruntfile.js',
				'package.json',
				'<%= pkg.name %>.js',
			],
			options: {
				// JSHintの初期値を上書きしたい場合、ここにオプションを更に追加します
				globals: {
					jQuery: true,
					console: true,
					module: true
				},
			}
		},
		watch:{
			files:['*.js'],
			tasks:['jshint','uglify']
		},
		'http-server':{
			'dev':{
				root:'example',
				port:8282,
				host: "127.0.0.1",
				autoIndex: true,
				defaultExt: "html"
			}
		}
	});
	//grunt-contribプラグインの読み込み
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-http-server');
	//エイリアスタスクの定義(開発用)
	//grunt.registerTask('default',['jshint','concat','uglify','watch.development']);
	//テストエイリアスタスク
	//grunt.registerTask('jasminetest',['jasmine','watch:jasminwatch']);
	//公開用エイリアスタスク
	//grunt.registerTask('production',['compass:production','watch:production']);
};