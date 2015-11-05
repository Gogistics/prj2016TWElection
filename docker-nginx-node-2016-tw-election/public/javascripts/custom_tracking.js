/* twitter */
(function ($) {
  console.log('start to init tracking...');

  window.twitter_tracking_handler = window.twitter_tracking_handler || {
    default_location : [[23.893589, 121.083589]],
    count : 0,
    is_ringtone_alert_on : true,
    init_stream_chart : function(){
      //
      var n = 245,
        duration = 750,
        now = new Date(Date.now() - duration),
        data = d3.range(n).map(function(){ return 0;});

      var margin = {
        top: 5,
        right: 0,
        bottom: 30,
        left: 50
      },
      width = 800 - margin.right,
      height = 150 - margin.top - margin.bottom;

      var x = d3.time.scale().domain([now - (n -2) * duration, now - duration]).range([0, width]);

      var y = d3.scale.linear().domain([0, 5]).range([height, 0]);

      var line = d3.svg.line().interpolate('basis').x(function(d, i){ return x(now - (n - 1 - i) * duration)});

      var svg = d3.select('div#twitter_stream_chart')
                  .append('p')
                  .append('svg')
                  .attr('width', width + margin.left + margin.right)
                  .style('margin-left', -margin.left + 'px')
                  .append('g')
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      svg.append('defs').append('clipPath').attr('id', 'clip').append('rect').attr('width', width).append('height', height);

      var x_axis = svg.append('g')
                      .attr('class', 'x axis')
                      .attr('transform', 'translate(0,' + height + ')')
                      .call(x.axis = d3.svg.axis().scale(x).orient('bottom'));

      var y_axis = svg.append('g')
                      .attr('class', 'y axis')
                      .call(d3.svg.axis().scale(y).orient('left').ticks(5).tickFormat(d3.format('d')));

      var path = svg.append('g')
                    .attr('clip-path', 'url(#clip)')
                    .append('path')
                    .datum(data)
                    .attr('class', 'liine');

      var transition = d3.select({})
                        .transition()
                        .duration(750)
                        .ease('linear');

      // make grid
      var make_x_axis = function(){
        return d3.svg.axis().scale(x).orient('bottom').ticks(5);
      };
      var make_y_axis = function(){
        return d3.svg.axis().scale(y).orient('left').ticks(5);
      };

      svg.append('svg:g').attr('class', 'grid').call(make_y_axis().tickSize(-width, 0, 0).tickFormat(''));
      svg.append('text').attr('class', 'label').attr('transform', 'rotate(-90)').attr('y', -50).attr('x', 0 - (height / 2) - 20).attr('dy', '1em').style('font-size', '15px').text('Tweets');


      // start tick
      (function tick(){
        //
        transition = transition.each(function(){
          //
          now = new Date();
          x.domain([now - (n - 2) * duration, now - duration]);
          y.domain([0, d3.max(data)]);

          // alert ringtone (incomplete)
          if(window.twitter_tracking_handler.is_ringtone_alert_on && window.twitter_tracking_handler.count > 4){
            window.twitter_tracking_handler.play_alert_ringtone('/public/sounds/ringtone_1.wav');
          }
          //
          data.push(Math.min(5, window.twitter_tracking_handler.count));
          window.twitter_tracking_handler.count = 0;

          //
          svg.select('.line')
             .attr('d', line)
             .attr('transform', null);

          // slide the x-axis left
          x_axis.call(x.axis);

          path.transition().attr('transform', 'translate(' + x(now - (n - 1) * duration) + ')');

          data.shift();

        }).transition().each('start', tick);
      })();
    },
    play_alert_ringtone : function(arg_sound_path){
      //
      var current_time = new Date();
      document.getElementById('high_peak_alert').innerHTML = '<embed src="' + arg_sound_path + '" hidden="true" autostart="true" loop="false" />';
      $('span#tweets_peak').text('Tweet peak at ' + current_time.toLocalTimeString() + '-' + current_time.toLocalTimeString());
    }
  }

  window.twitter_tracking_handler.init_stream_chart();
  // end

  /* tracking alert */
  $( 'input#tracking_alert_onoffswitch' ).change(function() {
      if($(this).prop('checked')){
          window.twitter_tracking_handler.is_ringtone_alert_on = true;
      }else{
          window.twitter_tracking_handler.is_ringtone_alert_on = false;
      }
  });

  /* map */
  window.twitter_map_handler = window.twitter_map_handler || {
    map : undefined,
    tiles : undefined,
    my_icon : undefined,
    d3_svg : undefined,
    d3_gradient : undefined,
    d3_data : undefined,
    d3_circles : undefined,
    is_set_map_center_on : true,
    default_location : [23.893589, 121.083589],
    defualt_circles : [[23.893589, 121.083589]],
    init_map : function(){
      // init map
      if(this.map === undefined){
        // init map
        this.map = new L.map(tweets_map).setView( this.default_location, 8);

        // set map tiles
        L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© + Openstreetmap Contributors',
          maxZoom: 18,
        }).addTo(this.map);
        this.map._initPathRoot();

        // set d3
        if(this.d3_svg === undefined){
          this.d3_svg = d3.select("#tweets_map").select("svg");
        }

        // define the gradient
        this.d3_gradient = this.d3_svg.append("svg:defs")
                                .append("svg:radialGradient")
                                .attr("id", "gradient")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "100%")
                                .attr("spreadMethod", "pad");

        // Define the gradient colors
        this.d3_gradient.append("svg:stop")
                        .attr("offset", "0%")
                        .attr("stop-color", "#00f")
                        .attr("stop-opacity", 1);

        this.d3_gradient.append("svg:stop")
                        .attr("offset", "100%")
                        .attr("stop-color", "#fff")
                        .attr("stop-opacity", 0);

        //
        this.d3_data = this.defualt_circles;
        // set lat_lng for Leaflet
        this.d3_data.forEach(function(d) {
            d.LatLng = new L.LatLng(d[0],d[1])
        });
                        
        // append circle
        var tooltip = d3.select("div#map_tip")
                        .append("div")
                        .style("position", "absolute")
                        .style("z-index", "10000")
                        .style("visibility", "hidden");

        var g = this.d3_svg.append("g");
        this.d3_circles = g.selectAll("circle")
                        .data(this.d3_data)
                        .enter()
                        .append("circle")
                        .attr('r', 0)
                        .attr('class', 'location_circle')
                        .attr('fill', 'url(#gradient)')
                        .on("mouseover", function(){return tooltip.style("visibility", "visible");})
                        .on("mousemove", function(d){return tooltip.html('tweet location: ' + d).style("top", (d3.event.pageY - 700)+"px").style("left",(d3.event.pageX + 15)+"px");})
                        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
                        
        window.twitter_map_handler.map.on("viewreset", this.update_d3_elem_on_map);
        this.update_d3_elem_on_map();

        //
        var map_popup = L.popup();
        map_popup.setLatLng( [ 23.893589, 121.083589] )
                        .setContent( '<div style="text-align: center;">' +
                                     '<p>Track 2016 TW Election on Twitter</p>' +
                                     '<img style="width: 80px;" src="/public/javascripts/leaflet-0.7/images/twitter-1.png"><br>' +
                                     '</div>')
                        .openOn(this.map);
      }
    },
    update_d3_elem_on_map : function(){
        window.twitter_map_handler.d3_circles.attr("transform", 
            function(d) { 
                return "translate("+ 
                window.twitter_map_handler.map.latLngToLayerPoint(d.LatLng).x +","+ 
                window.twitter_map_handler.map.latLngToLayerPoint(d.LatLng).y +")";
            }
        ).transition()
        .duration(900)
        .delay(800)
        .attr('r', 100)
        .style("opacity",0)
        .each("end", function(){
            d3.select(this)
              .transition()
              .duration(700)
              .style("r", 20)
              .style("opacity",0.8);
        });
    },
    move_map : function(arg_percentage_text, arg_geo_info){
        var avg_latlng_popup = L.popup();
        
        // set map center if true
        if(this.is_set_map_center_on === true){
            // set map center to the target location
            this.map.setView({
                lat : arg_geo_info.lat,
                lng : arg_geo_info.lng
            }, 8);
            
            // append popup view
            avg_latlng_popup.setLatLng( [ arg_geo_info.lat, arg_geo_info.lng] )
                            .setContent( arg_percentage_text )
                            .openOn(this.map);
        }
    }
  }
  // end
  window.twitter_map_handler.init_map();

  // socket io (incomplete)
  var socket = io.connect('http://ec2-52-32-92-0.us-west-2.compute.amazonaws.com:8000'); // temp. ip & port for data stream
  socket.on('connect', function(){
      console.log('get connected...');
  });
  socket.on( 'tweet', function(message) {
      console.log(message);
  });
  socket.on('event', function(data){
      console.log(data);
  });
  socket.on('disconnect', function(){
      console.log('disconnect...');
  });

  // fb

  //
  FB.ui({
    method: 'share_open_graph',
    action_type: 'og.likes',
    action_properties: JSON.stringify({
      object:'https://developers.facebook.com/docs/',
    })
  }, function(response){
    // Debug response (optional)
    console.log(response);
  });
})(jQuery);
