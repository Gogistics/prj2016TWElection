/* twitter */
(function ($) {
  window.twitter_tracking_handler = window.twitter_tracking_handler || {
    default_location : [[23.893589, 121.083589]],
    count : 0,
    is_ringtone_alert_on : true,
    init_stream_chart : function(){
        var n = 245,
            duration = 750,
            now = new Date(Date.now() - duration),
            data = d3.range(n).map(function() { return 0; });

        var margin = {top: 5, right: 0, bottom: 30, left: 50},
            width = 750 - margin.right,
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
            .append("p")
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
            .attr("y", -50)
            .attr("x", 0 - ( height / 2 ) - 20 )
            .attr("dy","1em")
            .style("font-size", "15px")
            .text("Tweets");

        (function tick() {
          transition = transition.each(function() {

            // update the domains
            now = new Date();
            x.domain([now - (n - 2) * duration, now - duration]);
            y.domain([0, 5]);

            // alert ringtone
            if(window.twitter_tracking_handler.is_ringtone_alert_on && window.twitter_tracking_handler.count > 4){
              window.twitter_tracking_handler.play_alert_ringtone('/public/sounds/ringtone_1.wav');
            }

            // push the accumulated count onto the back, and reset the count
            data.push(window.twitter_tracking_handler.count);
            window.twitter_tracking_handler.count = 0;

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
  // end

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
      if(window.twitter_tweets_handler.tweets_list.length > 0 && !window.twitter_tweets_handler.is_appending){
        //
        window.twitter_tweets_handler.is_appending = true;
        window.twitter_tweets_handler.append_tweet(window.twitter_tweets_handler.tweets_list.pop());
      }
      setTimeout(window.twitter_tweets_handler.trigger_append_event, 6000);
    },
    append_tweet : function(arg_tweet){
      //
      var append_li = function(){
        //
        var tweet_url = arg_tweet.text.match(/(http[s]*:[^\s]+)/),
            tweet = arg_tweet.text.replace(/(http[s]*:[^\s]+)/gi, ''),
            tweet_content = '',
            time_ary = arg_tweet.created_at.split(' '),
            tweet_time = time_ary[1] + ' ' + time_ary[2] + '-' + time_ary[5] + ' ' + time_ary[3];

            //
        if (tweet_url !== null){
            tweet_url = tweet_url[0];
            tweet_content = '<li class="hidden_elem list-group-item" >' +
                            '<div>' +
                            '<img src="' + arg_tweet.user.profile_image_url + '"><br>' +
                            '<a href="https://twitter.com/' + arg_tweet.user.screen_name + '" target="_blank" >@' + arg_tweet.user.screen_name + '</a><br>' +
                            '<span>' + tweet_time + '</span>' +
                            '</div>' +
                            '<span>' + tweet + '&nbsp;</span>' +
                            '<a href="' + tweet_url + '" target="_blank">&nbsp;' + tweet_url + '</a>' +
                            '</li>';
        }else{
            tweet_content = '<li class="hidden_elem list-group-item" >' +
                            '<div>' +
                            '<img src="' + arg_tweet.user.profile_image_url + '"><br>' +
                            '<a href="https://twitter.com/' + arg_tweet.user.screen_name + '" target="_blank" >@' + arg_tweet.user.screen_name + '</a><br>' +
                            '<span>' + tweet_time + '</span>' +
                            '</div>' +
                            '<span>' + tweet + '</span>' +
                            '</li>';
        }
                    
        $('ul#tweet_list').prepend(tweet_content);
        $('ul#tweet_list li.hidden_elem').fadeIn(1000, function(){
            window.twitter_tweets_handler.is_appending = false;
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
            d.LatLng = new L.LatLng(d[0], d[1]);
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
                        .on("mousemove", function(d){return tooltip.html('tweet location: ' + d).style("top", (d3.event.pageY - 10)+"px").style("left",(d3.event.pageX + 10)+"px");})
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
    move_map : function(arg_tweet_text, arg_geo_info){
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
                            .setContent( arg_tweet_text )
                            .openOn(this.map);
        }
    },
    animate_tweet_map : function(){
      //
      if(window.twitter_map_handler.location_ary.length > 0){
        var current_location = window.twitter_map_handler.location_ary.pop();

        if(current_location !== undefined){
          //
          window.twitter_map_handler.move_map(current_location.popup_content, { lat : current_location.lat, lng : current_location.lng });

          //
          window.twitter_map_handler.add_new_location([[ current_location.lat, current_location.lng ]]);
        }
      }

      //
      setTimeout(window.twitter_map_handler.animate_tweet_map, 6000);
    },
    add_new_location : function(arg_location_ary){
      //
      arg_location_ary.forEach(function(d){
        //
        d.LatLng = new L.LatLng(d[0], d[1]);
      });

      // check if d3 svg exiting
      if(this.d3_svg){
        // create new location
        var new_location = this.d3_svg
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
          return 'translate(' + window.twitter_map_handler.map.latLngToLayerPoint(d.LatLng).x + ',' +
                                window.twitter_map_handler.map.latLngToLayerPoint(d.LatLng).y + ')';
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
          this.d3_circles.push(new_location.pop());
      }
    },
    find_geo_info : function(arg_location, arg_created_time, arg_user_img_url, arg_nickname, arg_tweet){
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
                tweet = arg_tweet.replace(/(http[s]*:[^\s]+)/gi, ''),
                time_ary = arg_created_time.split(' ');
                tweet_time = time_ary[1] + ' ' + time_ary[2] + '-' + time_ary[5] + ' ' + time_ary[3],
                display_name = val.display_name.split(','),
                country = display_name[display_name.length - 1].trim();
            //
            var split_tweet = arg_tweet.split(' ');

            //
            var content = '';
            if(tweet_url !== undefined && tweet_url !== null && tweet_url !== ''){
              //
              content = '<div class="tweet_on_map">' +
                       '<img src="' + arg_user_img_url + '"/><br>' +
                       '<div><br/>' +
                       '<a href="https://twitter.com/' + arg_nickname + '" target="_blank">@' + arg_nickname + '</a>' +
                       '</div>' +
                       '<p>' +
                       '<span class="tweet_time_country">' + tweet_time + ',&nbsp;' + country + '</span><br>' +
                       '<span class="tweet_text">' + tweet + '</span><br>' +
                       '<a href="' + tweet_url[0] + '" target="_blank">' + tweet_url[0] + '</a></p>' +
                       '</div>';
            }else{
              //
              content = '<div class="tweet_on_map">' +
                       '<img src="' + arg_user_img_url + '"/><br>' +
                       '<div><br/>' +
                       '<a href="https://twitter.com/' + arg_nickname + '" target="_blank">@' + arg_nickname + '</a>' +
                       '</div>' +
                       '<p>' +
                       '<span class="tweet_time_country">' + tweet_time + ',&nbsp;' + country + '</span><br>' +
                       '<span class="tweet_text">' + tweet + '</span></p>' +
                       '<a href="' + tweet_url[0] + '" target="_blank">' + tweet_url[0] + '</a></p>' +
                       '</div>';
            }

            //
            window.twitter_map_handler.location_ary.push( { popup_content : content,
                                    lat : Number(val.lat).toFixed(5),
                                    lng : Number(val.lon).toFixed(5) });
          }
        });
      });
    },
    start_map_animation : function(){
      //
      setTimeout( window.twitter_map_handler.animate_tweet_map, 3000 );
    }
  }
  // end

  // init map
  window.twitter_map_handler.init_map();

  // start map animation
  window.twitter_map_handler.start_map_animation();

  // socket io (incomplete)
  var socket = io.connect('http://ec2-52-32-122-42.us-west-2.compute.amazonaws.com:8000'); // temp. ip & port for data stream
  socket.on('connect', function(){
      console.log('get connected...');
      setTimeout(window.twitter_tweets_handler.trigger_append_event, 2000);
  });
  socket.on( 'tweet', function(message) {
      window.twitter_tracking_handler.count++;
      window.twitter_tweets_handler.tweets_list.push(message);

      //
      var geo_location_alternative = message.geo || message.user.location || message.user.time_zone;
      if(geo_location_alternative !== null){
        //
        setTimeout(window.twitter_map_handler.find_geo_info(message.user.location,
                                                            message.created_at,
                                                            message.user.profile_image_url,
                                                            message.user.screen_name,
                                                            message.text), 2000);
      }
  });
  socket.on('event', function(data){
      console.log(data);
  });
  socket.on('disconnect', function(){
      console.log('disconnect...');
  });


})(jQuery);
