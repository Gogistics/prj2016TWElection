/* twitter */
'use strict';
(function($) {
  window.twitter_tracking_handler = window.twitter_tracking_handler || {
    default_location : [[23.893589, 121.083589]], // default location; here location is set at taiwan
    count : 0, // count of incoming tweets
    is_ringtone_alert_on : true,
    is_mobile : function(){
      // check if user device
      var is_mobile = false; //initiate as false
        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))){
            is_mobile = true;
        }
        return is_mobile;
    },
    init_stream_chart : function(){
      // set "this" obj
      var _this = this;

      // d3 configuration
        var n = 245,
            duration = 750,
            now = new Date(Date.now() - duration),
            data = d3.range(n).map(function() { return 0; }); // default values; here all are set to zero

        // basic layout setting of the chart
        var margin = {top: 5, right: 0, bottom: 20, left: 50},
            width = 680 - margin.left,
            height = 150 - margin.top - margin.bottom;

        // x and y axis
        var x = d3.time.scale()
            .domain([now - (n - 2) * duration, now - duration])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([0, 5])
            .range([height, 0]);
        // end of x and y axis

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d, i) { return x(now - (n - 1 - i) * duration); })
            .y(function(d, i) { return y(d); });

        // configure svg element
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
        // end of svg configuration

        //
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

        var transition = d3.select({})
                          .transition()
                          .duration(750)
                          .ease("linear");
            
        /* make grid */
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

        // append axis label
        svg.append("text")
            .attr("class", "label")
            .attr("transform","rotate(-90)")
            .attr("y", -40)
            .attr("x", 0 - ( height / 2 ) - 20 )
            .attr("dy","1em")
            .style("font-size", "13px")
            .text("Tweets");

        // start ticking
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
  // end of tracking alert

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

        // set default data
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

        // set map popup
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
                time_ary = arg_created_time.split(' '),
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

  /* socket io handler */
  // socket io (incomplete)
  var socket = io.connect('ec2-52-32-189-2.us-west-2.compute.amazonaws.com:8000'); // temp. ip & port for data stream
  socket.on('connect', function(){
      console.log('get connected...');
      var _this = window.twitter_tweets_handler;
      setTimeout( _this.trigger_append_event.bind(_this), 2000);
  });
  socket.on( 'tweet', function(message) {
      var _this = window.twitter_map_handler;
      window.twitter_tracking_handler.count++;
      window.twitter_tweets_handler.tweets_list.push(message);

      //
      var geo_location_alternative = message.geo || message.user.location || message.user.time_zone;
      if(geo_location_alternative !== null){
        //
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
