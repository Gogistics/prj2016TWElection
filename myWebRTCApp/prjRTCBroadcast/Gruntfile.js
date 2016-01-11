/* Grunt Tasks  */
module.exports = function(grunt){
    grunt.initConfig({
        // basic setting
        pkg: grunt.file.readJSON('package.json'),

  // check JS code
  jshint: {
      files: ['Gruntfile.js', 'public/javascripts/*.js'],
      options: {
          globals: {
          jQuery: true,
      },
      },
  },
        
  // minify css files
  cssmin:{
      combine: {
          files: {
        'public/stylesheets/style.min.css': ['public/stylesheets/style.css']
    },
      },
  },

  //
  uglify:{
      options: {
          banner: '\/\*\! \<\%\= pkg.name \%\> \<\%\= grunt.template.today\(\"dd-mm-yyyy\"\) \%\> \*\/',
          report: 'min',
          mangle: false
      },
            combine: {
                files: {
                    'public/javascripts/app.min.js': ['public/javascripts/app.js'],
                    'public/javascripts/app_monitor.min.js': ['public/javascripts/app_monitor.js'],
                    'public/javascripts/app_monitor_record_rtc.min.js': ['public/javascripts/app_monitor_record_rtc.js'],
                    'public/javascripts/app_voting_station.min.js': ['public/javascripts/app_voting_station.js'],
                    'public/javascripts/app_voting_station_record_rtc.min.js': ['public/javascripts/app_voting_station_record_rtc.js'],
                    'public/javascripts/rtc_client.min.js': ['public/javascripts/rtc_client.js'],
                    'public/javascripts/adapter.min.js': ['public/javascripts/adapter.js'],
                    'public/javascripts/record_rtc.min.js': ['public/javascripts/record_rtc.js'],
                    'public/javascripts/binaryjs_client.min.js': ['public/javascripts/binaryjs_client.js'],
                },
            },
        },
    });

    // load the plugin
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // register tasks
    grunt.registerTask('default', ['jshint', 'cssmin', 'uglify']);
};