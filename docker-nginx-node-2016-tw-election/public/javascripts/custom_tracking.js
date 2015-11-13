/* twitter */
(function ($) {
  window.twitter_tracking_handler = window.twitter_tracking_handler || {
    default_location : [[23.893589, 121.083589]],
    count : 0,
    is_ringtone_alert_on : true,
    init_stream_chart : function(){
      //
      var _this = this;

      // d3 configuration
        var n = 245,
            duration = 750,
            now = new Date(Date.now() - duration),
            data = d3.range(n).map(function() { return 0; });

        var margin = {top: 5, right: 0, bottom: 20, left: 50},
            width = 680 - margin.left,
            height = 150 - margin.top - margin.bottom;

        var x = d3.time.scale()
            .domain([now - (n - 2) * duration, now - duration])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([0, 5])
            .range([height, 0]);

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d, i) { return x(now - (n - 1 - i) * duration); })
            .y(function(d, i) { return y(d); });

        var svg = d3.select("div#twitter_stream_chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("margin-left", -margin.left + "px")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        var x_axis = svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));
            
        var y_axis = svg.append("g")
                        .attr("class", "y axis")
                        .call(d3.svg.axis().scale(y)
                        .orient("left")
                        .ticks(5)
                        .tickFormat(d3.format("d")));

        var path = svg.append("g")
                    .attr("clip-path", "url(#clip)")
                    .append("path")
                    .datum(data)
                    .attr("class", "line");

        var transition = d3.select({}).transition()
            .duration(750)
            .ease("linear");
            
        /* make grid */
        function make_x_axis() {        
            return d3.svg.axis()
                .scale(x)
                 .orient("bottom")
                 .ticks(5)
        }

        function make_y_axis() {        
            return d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(5)
        }

        svg.append("svg:g")         
        .attr("class", "grid")
        .call(make_y_axis()
        .tickSize(-width, 0, 0)
        .tickFormat( "" ));
        /* end of make grid */

        svg.append("text")
            .attr("class", "label")
            .attr("transform","rotate(-90)")
            .attr("y", -40)
            .attr("x", 0 - ( height / 2 ) - 20 )
            .attr("dy","1em")
            .style("font-size", "13px")
            .text("Tweets");

        (function tick() {
          transition = transition.each(function() {

            // update the domains
            now = new Date();
            x.domain([now - (n - 2) * duration, now - duration]);
            y.domain([0, 5]);

            // alert ringtone
            if(_this.is_ringtone_alert_on && _this.count > 4){
              _this.play_alert_ringtone('/public/sounds/ringtone_1.wav');
            }

            // push the accumulated count onto the back, and reset the count
            data.push(_this.count);
            _this.count = 0;

            // redraw the line
            svg.select(".line")
                .attr("d", line)
                .attr("transform", null);

            // slide the x-axis left
            x_axis.call(x.axis);

            // slide the line left
            path.transition()
                .attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");

            // pop the old data point off the front
            data.shift();

          }).transition().each("start", tick);
        })();
    },
    play_alert_ringtone : function(arg_sound_path){
      //
      var current_time = new Date();
      document.getElementById('high_peak_alert').innerHTML = '<embed src="' + arg_sound_path + '" hidden="true" autostart="true" loop="false" />';
      $('span#tweets_peak').text('Tweet peak at ' + current_time.toLocaleTimeString() + '-' + current_time.toLocaleTimeString());
    }
  };

  if(!window.is_mobile){
    window.twitter_tracking_handler.init_stream_chart();
  }
  // end of stream chart

  /* tracking alert */
  $( 'input#tracking_alert_onoffswitch' ).change(function() {
      if($(this).prop('checked')){
          window.twitter_tracking_handler.is_ringtone_alert_on = true;
      }else{
          window.twitter_tracking_handler.is_ringtone_alert_on = false;
      }
  });
  // end

  /* twitter list handler */
  window.twitter_tweets_handler = window.twitter_tweets_handler || {
    tweets_list : [],
    is_appending : false,
    trigger_append_event : function(){
      //
      var _this = this;
      if(_this.tweets_list.length > 0 && !_this.is_appending){
        //
        _this.is_appending = true;
        _this.append_tweet(_this.tweets_list.pop());
      }
      setTimeout( _this.trigger_append_event.bind(_this), 6000);
    },
    append_tweet : function(arg_tweet){
      //
      var _this = this;
      var append_li = function(){
        //
        var tweet_url = arg_tweet.text.match(/(http[s]*:[^\s]+)/),
            tweet = arg_tweet.text.replace(/(http[s]*:[^\s]+)/gi, function(arg_link){
                return '<a href="' + arg_link + '" target="_blank">' + arg_link + '</a>';
            }),
            tweet_content = '',
            time_ary = arg_tweet.created_at.split(' '),
            tweet_time = time_ary[1] + ' ' + time_ary[2] + '-' + time_ary[5] + ' ' + time_ary[3];

        tweet_content = '<li class="hidden_elem list-group-item" >' +
                            '<div>' +
                            '<img src="' + arg_tweet.user.profile_image_url + '"><br>' +
                            '<a href="https://twitter.com/' + arg_tweet.user.screen_name + '" target="_blank" >@' + arg_tweet.user.screen_name + '</a><br>' +
                            '<span>' + tweet_time + '</span>' +
                            '</div>' +
                            '<span>' + tweet + '&nbsp;</span>' +
                            '</li>';
        
        $('ul#tweet_list').prepend(tweet_content);
        $('ul#tweet_list li.hidden_elem').fadeIn(1000, function(){
          _this.is_appending = false;
        });
      }

      // append li
      if( $('ul#tweet_list li').length > 29 ){
          // add animation
          $('ul#tweet_list li:last').fadeOut('slow', function(){
              $(this).remove();
              append_li();
          });
      }else{
          append_li();
      }
    },
    retrieve_latest_20_tweets : function(){
      //
    }
  }

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
    location_ary : [],
    tweets_list : [],
    is_appending : false,
    init_map : function(){
      // init map
      var _this = this;
      if(_this.map === undefined){
        // init map
        _this.map = new L.map(tweets_map)
                        .setView( _this.default_location, 8);

        // set map tiles
        L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© + Openstreetmap Contributors',
          maxZoom: 18,
        }).addTo(_this.map);

        //
        _this.map._initPathRoot();

        // set d3
        if(this.d3_svg === undefined){
          this.d3_svg = d3.select("div#tweets_map").select("svg");
        }

        // define the gradient
        _this.d3_gradient = this.d3_svg.append("svg:defs")
                                      .append("svg:radialGradient")
                                      .attr("id", "gradient")
                                      .attr("x1", "0%")
                                      .attr("y1", "0%")
                                      .attr("x2", "100%")
                                      .attr("y2", "100%")
                                      .attr("spreadMethod", "pad");

        // Define the gradient colors
        _this.d3_gradient.append("svg:stop")
                        .attr("offset", "0%")
                        .attr("stop-color", "#00f")
                        .attr("stop-opacity", 1);

        _this.d3_gradient.append("svg:stop")
                        .attr("offset", "100%")
                        .attr("stop-color", "#fff")
                        .attr("stop-opacity", 0);

        //
        _this.d3_data = _this.defualt_circles;
        // set lat_lng for Leaflet
        _this.d3_data.forEach(function(d) {
            d.LatLng = new L.LatLng(d[0], d[1]);
        });
                        
        // append circle
        var tooltip = d3.select("div#map_tip")
                        .append("div")
                        .style("position", "absolute")
                        .style("z-index", "10000")
                        .style("visibility", "hidden");

        var g = _this.d3_svg.append("g");
        _this.d3_circles = g.selectAll("circle")
                          .data(_this.d3_data)
                          .enter()
                          .append("circle")
                          .attr('r', 0)
                          .attr('class', 'location_circle')
                          .attr('fill', 'url(#gradient)')
                          .on("mouseover", function(){return tooltip.style("visibility", "visible");})
                          .on("mousemove", function(d){return tooltip.html('tweet location: ' + d).style("top", (d3.event.pageY - 10)+"px").style("left",(d3.event.pageX + 10)+"px");})
                          .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
                        
        _this.map.on( "viewreset", _this.update_d3_elem_on_map.bind(_this) );

        //
        setTimeout( _this.update_d3_elem_on_map.bind(_this), 500 );

        //
        var map_popup = L.popup();
        map_popup.setLatLng( [ 23.893589, 121.083589] )
                        .setContent( '<div style="text-align: center;">' +
                                     '<p>Track 2016 TW Election on Twitter</p>' +
                                     '<img style="width: 80px;" src="/public/javascripts/leaflet-0.7/images/twitter-1.png"><br>' +
                                     '</div>')
                        .openOn(_this.map);
      }
    },
    update_d3_elem_on_map : function(){
      var _this = this;
      _this.d3_circles.attr("transform", 
          function(d) { 
              return "translate("+ 
              _this.map.latLngToLayerPoint(d.LatLng).x +","+ 
              _this.map.latLngToLayerPoint(d.LatLng).y +")";
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
    move_map : function(arg_tweet_text, arg_geo_info){
      //
      var _this = this;
      var avg_latlng_popup = L.popup();
      
      // set map center if true
      if(_this.is_set_map_center_on === true){
          // set map center to the target location
          _this.map.setView({
              lat : arg_geo_info.lat,
              lng : arg_geo_info.lng
          }, 8);
          
          // append popup view
          avg_latlng_popup.setLatLng( [ arg_geo_info.lat, arg_geo_info.lng] )
                          .setContent( arg_tweet_text )
                          .openOn(this.map);
      }
    },
    animate_tweet_map : function(){
      //
      var _this = this;
      if(_this.location_ary.length > 0){
        var current_location = _this.location_ary.pop();

        if(current_location !== undefined){
          //
          _this.move_map(current_location.popup_content, { lat : current_location.lat, lng : current_location.lng });
          _this.add_new_location([[ current_location.lat, current_location.lng ]]);
        }
      }

      //
      setTimeout( _this.animate_tweet_map.bind(_this), 5000);
    },
    add_new_location : function(arg_location_ary){
      var _this = this;
      //
      arg_location_ary.forEach(function(d){ d.LatLng = new L.LatLng(d[0], d[1]); });

      // check if d3 svg exiting
      if(_this.d3_svg){
        // create new location
        var new_location = _this.d3_svg
                                .append('g')
                                .selectAll('circle')
                                .data(arg_location_ary)
                                .enter()
                                .append('circle')
                                .attr('r', 0)
                                .attr('class', 'location_circle')
                                .attr('fill', 'url(#gradient');

        new_location.attr('transform', function(d){
          //
          return 'translate(' + _this.map.latLngToLayerPoint(d.LatLng).x + ',' +
                                _this.map.latLngToLayerPoint(d.LatLng).y + ')';
        }).transition()
          .duration(1000)
          .delay(600)
          .attr('r', 100)
          .style('opacity', 0)
          .each('end', function(){
            //
            d3.select(this)
              .transition()
              .duration(600)
              .style('r', 20)
              .style('opacity', 0.8);
          });

          //
          _this.d3_circles.push(new_location.pop());
      }
    },
    find_geo_info : function(arg_location, arg_created_time, arg_user_img_url, arg_nickname, arg_tweet){
      var _this = this;
      //
      $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + arg_location, function(data){
        //
        $.each(data, function(key, val){
          //
          if( (!isNaN(parseFloat(val.lat)) && isFinite(val.lat) ) &&
              (!isNaN(parseFloat(val.lon)) && isFinite(val.lon)) &&
              arg_user_img_url !== null && arg_user_img_url !== '' ){
            //
            var tweet_url = arg_tweet.match(/(http[s]*:[^\s]+)/),
                tweet = arg_tweet.replace(/(http[s]*:[^\s]+)/gi, function(arg_link){
                  return '<a href="' + arg_link + '" target="_blank">' + arg_link + '</a>';
                }),
                time_ary = arg_created_time.split(' ');
                tweet_time = time_ary[1] + ' ' + time_ary[2] + '-' + time_ary[5] + ' ' + time_ary[3],
                display_name = val.display_name.split(','),
                country = display_name[display_name.length - 1].trim();

            //
            var content = '<div class="tweet_on_map">' +
                         '<img src="' + arg_user_img_url + '"/><br>' +
                         '<div><br/>' +
                         '<a href="https://twitter.com/' + arg_nickname + '" target="_blank">@' + arg_nickname + '</a>' +
                         '</div>' +
                         '<p>' +
                         '<span class="tweet_time_country">' + tweet_time + ',&nbsp;' + country + '</span><br>' +
                         '<span class="tweet_text">' + tweet + '</span></p>' +
                         '</div>';
            //
            _this.location_ary.push( { popup_content : content,
                                    lat : Number(val.lat).toFixed(5),
                                    lng : Number(val.lon).toFixed(5) });
          }
        });
      });
    },
    start_map_animation : function(){
      //
      var _this = this;
      setTimeout( _this.animate_tweet_map.bind(_this), 3000 );
    }
  }
  // end

  // init map
  setTimeout( window.twitter_map_handler.init_map.bind(window.twitter_map_handler), 1000);

  // start map animation
  setTimeout( window.twitter_map_handler.start_map_animation.bind(window.twitter_map_handler), 1500);

  // socket io (incomplete)
  var socket = io.connect('http://ec2-52-32-122-42.us-west-2.compute.amazonaws.com:8000'); // temp. ip & port for data stream
  socket.on('connect', function(){
      console.log('get connected...');
      var _this = window.twitter_tweets_handler;
      setTimeout( _this.trigger_append_event.bind(_this), 2000);
  });
  socket.on( 'tweet', function(message) {
      var _this = window.twitter_map_handler;
      window.twitter_tweets_handler.count++;
      window.twitter_tweets_handler.tweets_list.push(message);

      //
      var geo_location_alternative = message.geo || message.user.location || message.user.time_zone;
      if(geo_location_alternative !== null){
        //
        console.log(_this);
        setTimeout( _this.find_geo_info.bind(_this, message.user.location,
                                                    message.created_at,
                                                    message.user.profile_image_url,
                                                    message.user.screen_name,
                                                    message.text), 2000 );
      }
  });
  socket.on('event', function(data){
      console.log(data);
  });
  socket.on('disconnect', function(){
      console.log('disconnect...');
  });

})(jQuery);
