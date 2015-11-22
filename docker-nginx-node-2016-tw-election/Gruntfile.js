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
        
        // name of plugin
  cssmin:{
      combine: {
          files: {
        'public/frontend_1/css/animate.min.css': ['public/frontend_1/css/animate.css'],
        'public/frontend_1/css/style.min.css': ['public/frontend_1/css/style.css'],
        'public/frontend_1/color/default.min.css': ['public/frontend_1/color/default.css'],
        'public/javascripts/leaflet-0.7/leaflet.min.css': ['public/javascripts/leaflet-0.7/leaflet.css'],
        'public/javascripts/leaflet-0.7/marker_cluster.default.min.css': ['public/javascripts/leaflet-0.7/marker_cluster.default.css'],
        'public/javascripts/leaflet-0.7/marker_cluster.min.css': ['public/javascripts/leaflet-0.7/marker_cluster.css'],
        'public/stylesheets/analysis.min.css': ['public/stylesheets/analysis.css'],
        'public/stylesheets/custom_tracking.min.css': ['public/stylesheets/custom_tracking.css'],
        'public/stylesheets/d3/style.min.css': ['public/stylesheets/d3/style.min.css']
    },
      },
  },

  //
  uglify:{
      options: {
          banner: '\/\*\! \<\%\= pkg.name \%\> \<\%\= grunt.template.today\(\"dd-mm-yyyy\"\) \%\> \*\/',
      },
            combine: {
                files: {
                    'public/frontend_1/js/jquery.scrollTo.min.js': ['public/frontend_1/js/jquery.scrollTo.js'],
                    'public/frontend_1/js/custom.min.js': ['public/frontend_1/js/custom.js'],
                    'public/javascripts/leaflet-0.7/leaflet.min.js': ['public/javascripts/leaflet-0.7/leaflet.js'],
                    'public/javascripts/leaflet-0.7/leaflet.markercluster-src.min.js': ['public/javascripts/leaflet-0.7/leaflet.markercluster-src.js'],
                    'public/javascripts/d3/d3.min.js': ['public/javascripts/d3/d3.js'],
                    'public/javascripts/d3/d3_tips.min.js': ['public/javascripts/d3/d3_tips.js'],
                    'public/javascripts/d3/box.min.js': ['public/javascripts/d3/box.js'],
                    'public/javascripts/socket.io-1.3.7.min.js': ['public/javascripts/socket.io-1.3.7.js'],
                    'public/javascripts/custom_facebook_analysis.min.js': ['public/javascripts/custom_facebook_analysis.js'],
                    'public/javascripts/custom_twitter_analysis.min.js': ['public/javascripts/custom_twitter_analysis.js'],
                    'public/javascripts/custom_plurk_analysis.min.js': ['public/javascripts/custom_plurk_analysis.js'],
                    'public/javascripts/custom_tracking.min.js': ['public/javascripts/custom_tracking.js'],
                },
            },
        },
    });


    // load the plugin
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'cssmin', 'uglify']);
};