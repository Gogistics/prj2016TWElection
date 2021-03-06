/* append scripts */
'use strict';
(function($){
  //
  var load_css = function(arg_href){
    //
    var css_link = $('<link rel="stylesheet" type="text/css" href="' + arg_href + '">');
    $('head').append(css_link);
  }

  // load css scripts for index page
  load_css('/public/frontend_1/css/bootstrap.min.css');
  load_css('/public/frontend_1/font-awesome/css/font-awesome.min.css');
  load_css('/public/frontend_1/css/animate.min.css');
  load_css('/public/frontend_1/css/style.min.css');
  load_css('/public/frontend_1/color/default.min.css');
  load_css('/public/javascripts/leaflet-0.7/leaflet.min.css');
  load_css('/public/javascripts/leaflet-0.7/marker_cluster.default.min.css');
  load_css('/public/javascripts/leaflet-0.7/marker_cluster.min.css');
})(jQuery);