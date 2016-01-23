/* twitter */
(function($) {
  'use strict';
  window.twitter_analysis_handler = window.twitter_analysis_handler || {
    get_analysis_collection : function(){
      //
      var _this = this;
      $.ajax({ // create an AJAX call...
          data: {
            token: 'ZRIcsERQBbPOgerGEhRthrt',
          },
          type: 'POST', // GET or POST
          url: '/services/get_twitter_tweets_analysis_collection_by_lang_type', // the file to call
          success: function(res) {
              if(res.request_status === 'successful'){
                // console.log(res.collecion);
                _this.append_categorized_data(res.collecion, res.count_of_total_tweets);
                _this.display_tweets_chart(res.collecion);
              }else{
                  console.log('fail...');
              };
          }
      });
    },
    append_categorized_data : function(arg_collection, arg_count_of_total_tweets){
      //
      var min_timestamp = undefined, max_timestamp = undefined;
      for(var ith_key in arg_collection){
        //
        var timestamp_set = arg_collection[ith_key]['timestamp_set'];
        var total_count = 0;
        for(var jth_key in timestamp_set){
          //
          if(min_timestamp === undefined){
            min_timestamp = jth_key;
          }else{
            min_timestamp = Math.min(min_timestamp, jth_key);
          }

          if(max_timestamp === undefined){
            max_timestamp = jth_key;
          }else{
            max_timestamp = Math.max(max_timestamp, jth_key);
          }
          total_count += timestamp_set[jth_key];
        }

        //
        var content = '<li class="list-group-item">' +
                      ith_key +
                      '<span class="label label-warning label-pill pull-right">' + total_count + ' (' + ( total_count / arg_count_of_total_tweets * 100 ).toFixed(2) + '%)' + '</span>' +
                      '</li>';
        $('ul#categorized_collection').append(content);
      }
      var min_date = new Date(min_timestamp),
          max_date = new Date(max_timestamp);
      $('p#categorized_collection_period').prepend('From&nbsp;' + ( min_date.getMonth() + 1) + '-' +
                                                              min_date.getDate() + '-' +
                                                              min_date.getFullYear() +
                                                  ' To&nbsp;' + ( max_date.getMonth() + 1) + '-' +
                                                            max_date.getDate() + '-' +
                                                            max_date.getFullYear() );
    },
    display_tweets_chart : function(arg_collection){
      var rearranged_collection = {};
      for(var ith_key in arg_collection){
        //
        for(var jth_key in arg_collection[ith_key]['timestamp_set']){
          //
          if(!rearranged_collection.hasOwnProperty(jth_key)){
            //
            rearranged_collection[jth_key] = arg_collection[ith_key]['timestamp_set'][jth_key];
          }else{
            //
            rearranged_collection[jth_key] += arg_collection[ith_key]['timestamp_set'][jth_key];
          }
        }
      }

      /* D3 config. */
      var margin = {top: 10, right: 10, bottom: 30, left: 60},
                    width = 460 - margin.left - margin.right,
                    height = 250 - margin.top - margin.bottom;

      var x = d3.time.scale().range([0, width]);
      var y0 = d3.scale.linear().range([height, 0]);

      var xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(5);

      var yAxisLeft = d3.svg.axis().scale(y0)
          .orient("left").ticks(5,"s");

      var valueline = d3.svg.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y0(d.value); });
          
      var svg = d3.select("div#tweets_chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");

      // make grid
      var make_y_axis = function() {        
          return d3.svg.axis()
              .scale(y0)
              .orient("left")
              .ticks(5)
      }

      svg.append("svg:g")         
          .attr("class", "grid")
          .call(make_y_axis().tickSize(-width, 0, 0).tickFormat( "" ));
      /* end of make grid */

      var build_chart = function(arg_rearranged_collection){
        //
        var new_collection_ary = [];
        for(var ith_key in arg_rearranged_collection){
          //
          new_collection_ary.push({ date: ( new Date( Number(ith_key) ) ), value: arg_rearranged_collection[ith_key] });
        }

        new_collection_ary.sort(function(a, b){
          //
          return a.date - b.date;
        });

        //
        x.domain(d3.extent(new_collection_ary, function(d) { return d.date; }));
        y0.domain([0, d3.max(new_collection_ary, function(d) {
            return Math.max(d.value); })]);

        svg.append("path")        // Add the valueline path.
           .attr("class", "line_1")
           .attr("d", valueline(new_collection_ary));

        svg.append("g")            // Add the X Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
        svg.append("g")
            .attr("class", "y axis")
            .style("fill", "#c79825")
            .call(yAxisLeft)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("dy", ".4em")
            .style("text-anchor", "end")
            .style("font-size", 12)
            .text("Tweets");

        // // mouseover event
        var bisectDate = d3.bisector(function(d) { return d.date; }).left,
            formatValue = d3.format(",.0f"),
            formatTweets = function(d) { return formatValue(d); };
        
        var div = d3.select("div#summary_tip").append("div")   
                    .attr("class", "tooltip")               
                    .style("opacity", 0);
        
        var focus = svg.append("g")
                       .attr("class", "focus")
                       .style("display", "none");

        focus.append("circle")
            .attr("r", 3);

        focus.append("text")
          .attr("x", 9)
          .attr("dy", ".3em");
          
        svg.append("rect")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseout", function() {
              div.transition()        
                  .duration(300)      
                  .style("opacity", 0);
          })
          .on("mousemove", function(){
                            var x0 = x.invert(d3.mouse(this)[0]),
                                i = bisectDate(new_collection_ary, x0, 1),
                                d0 = new_collection_ary[i - 1],
                                d1 = new_collection_ary[i];

                            if(d0 && d1){
                              var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                              div.transition()        
                                  .duration(200)
                                  .style("opacity", .9);      
                              div.html('<div><strong>Date:&nbsp;' + d.date.toLocaleDateString() + '</strong><br/>' +
                                      '<p><label>Tweets:&nbsp;</label>' + formatTweets(d.value) + '</p>' +
                                      '</div>')  
                                    .style("left", (d3.event.pageX + 10) + "px")     
                                    .style("top", (d3.event.pageY - 10) + "px");
                            }
          });
      }

      build_chart(rearranged_collection);
      // end of build_chart
    },
    get_twitter_tweets : function(){
      //
      var _this = this;
      // create an AJAX call to get data
      $.ajax({
          data: {
            token: 'IDQWpckbiKLZUotOgerGEhRAEBwxYA',
          },
          type: 'POST', // GET or POST
          url: '/services/get_twitter_tweets', // the file to call
          success: function(res) {
              if(res.request_status === 'successful'){
                // console.log(res.top_tweets_categories);
                _this.append_twitter_tweets(res.top_tweets_categories);
              }else{
                  console.log('fail...');
              };
          }
      });
    },
    append_twitter_tweets : function(arg_tweets){
      // arg_tweets.sort(function(elem_1, elem_2){
      //   return ( elem_2['tweet']['retweet_count'] - elem_1['tweet']['retweet_count'] ) || ( (new Date(elem_2['tweet']['created_at']).getTime()) - (new Date(elem_1['tweet']['created_at']).getTime()) );
      // });
      // var top_five_tweets = arg_tweets.slice(0,5);
      // console.log(top_five_tweets);
      var tweets_list = [];
      for(var ith_key in arg_tweets){
        tweets_list = tweets_list.concat(arg_tweets[ith_key]['tweets']);
      }
      // console.log(tweets_list);

      // build list
      var top_five_tweets_list = $('div#top_tweets_with_highest_retweet_count');
      top_five_tweets_list.empty();
      for( var jth in tweets_list){
        // replace http
        tweets_list[jth]['tweet']['text'] = tweets_list[jth]['tweet']['text'].replace(/(http[s]*:[^\s]+)/gi, function(arg_link){
                                            return '<a href="' + arg_link + '" target="_blank">' + arg_link + '</a>';
                                          });
        top_five_tweets_list.append('<div class="col-sm-4 col-xs-12">' +
                                    '<img src="' + tweets_list[jth]['tweet']['user']['profile_image_url'] + '"><br/>' +
                                    '<a href="https://twitter.com/' + tweets_list[jth]['tweet']['user']['screen_name'] + '" target="_blank" >@' + tweets_list[jth]['tweet']['user']['screen_name'] + '</a><br>' +
                                    '<span>Retweet&nbsp;Counts:&nbsp;' + tweets_list[jth]['tweet']['retweet_count'] + '</span><br/>' +
                                    '<span>Created at:&nbsp;' + (new Date(tweets_list[jth]['tweet']['created_at'])) + '</span><br/>' +
                                    '<p>' + tweets_list[jth]['tweet']['text'] + '</p>' +
                                    '</div>');
      }
    },
    prepend_elem_to_ary : function(arg_val, arg_ary){
      //
      var new_ary = arg_ary.slice(0);
      new_ary.unshift(arg_val);
      return new_ary;
    },
    get_tweets_keywords: function(){
      //
      var _this = this;
      // create an AJAX call to get data
      $.ajax({
          data: {
            token: 'IDQWpckbiKLZUotOgerGEhRAEBwxYA',
          },
          type: 'POST', // GET or POST
          url: '/services/get_tweets_keywords', // the file to call
          success: function(res) {
              if(res.request_status === 'successful'){
                // console.log(res.tweet_keywords.filtered_keywords);
                _this.build_keywords_circle_packing(res.tweet_keywords.filtered_keywords);
              }else{
                  console.log('fail...');
              };
          }
      });
    },
    build_keywords_circle_packing: function(arg_keywords){
      //
      arg_keywords.sort(function(a,b){ return (b.count - a.count); });
      var top_10 = arg_keywords.slice(0, 10);
      // console.log(top_10);

      //
      var margin = 5,
          diameter = 250;

      var color = d3.scale.linear()
          .domain([-1, 6])
          .range(["hsl(46, 96%, 64%, 95%)", "hsl(46, 96%, 32%, 95%)"])
          .interpolate(d3.interpolateHcl);

      var pack = d3.layout.pack()
          .padding(2)
          .size([diameter - margin, diameter - margin])
          .value(function(d) { return d.count; })

      var svg = d3.select("div#top_tweets_keywords").append("svg")
          .attr("width", diameter)
          .attr("height", diameter)
          .append("g")
          .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

      //
      var root = {word: 'Top-Tweets', children: top_10};
      var focus = root,
          nodes = pack.nodes(root), view;
      // console.log(root);
      // console.log(nodes);

      var circle = svg.selectAll("circle")
          .data(nodes)
          .enter().append("circle")
          .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
          .style("fill", function(d) { return d.children ? color(d.depth) : null; })
          .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

      var text = svg.selectAll("text")
          .data(nodes)
          .enter().append("text")
          .attr("class", "label")
          .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
          .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
          .text(function(d) { return d.word; });

      var node = svg.selectAll("circle,text");

      d3.select("div#top_tweets_keywords")
          .on("click", function() { zoom(root); });

      zoomTo([root.x, root.y, root.r * 2 + margin]);

      function zoom(d) {
        var focus0 = focus; focus = d;

        var transition = d3.transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .tween("zoom", function(d) {
              var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
              return function(t) { zoomTo(i(t)); };
            });

        transition.selectAll("text")
            .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
            .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
      }

      function zoomTo(v) {
        var k = diameter / v[2]; view = v;
        node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
        circle.attr("r", function(d) { return d.r * k; });
      }

      //
      d3.select(self.frameElement).style("height", diameter + "px");
    },
    get_tweet_geo_info: function(){
      //
      var _this = this;
      // create an AJAX call to get data
      $.ajax({
          data: {
            token: 'IDQWpckbiKLZUotOgerGEhRAEBwxYA',
          },
          type: 'POST', // GET or POST
          url: '/services/get_tweet_geo_info', // the file to call
          success: function(res) {
              if(res.request_status === 'successful'){
                // console.log(res.tweets_geo_info);
                _this.build_tweets_distribution_map(res.tweets_geo_info);
              }else{
                  console.log('fail...');
              };
          }
      });
    },
    build_tweets_distribution_map: function(arg_tweets_geo_info){
      //
      var _this = this,
          tweets_geo_location = {};
      var _leaflet_map_handler = {
        map: undefined,
        tiles: undefined,
        my_icon: undefined,
        init_map: function(){
          //
          if(typeof this.map === 'undefined'){
            //
            this.map = new L.Map('tweets_distribution_map', {center: [52.971157, 7.784151], zoom: 2}).addLayer(new L.TileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png'));
          }
        },
        move_map: function(arg_percentage, arg_latlng){
          //
        }
      }

      // color map
      var colors_map = {'0' :   '#ccfef8',
                    '10':  '#b4fcf6',
                    '20':  '#b4f6fc',
                    '30': '#86e8f1',
                    '40': '#5dd8e3',
                    '50': '#4ac7f5',
                    '60': '#4aa7f5',
                    '70': '#248ce4',
                    '80': '#1a70b8',
                    '90': '#085393',
                    '100': '#053964',
                    defaultFill: '#EFEFEF'};

      // init map
      _leaflet_map_handler.init_map();
      var width = 760, height = 550;
      var tip_div = d3.select('div#summary_tip')
                      .append('div')
                      .attr('class', 'tooltip')
                      .style('opacity', 0);
      var path = d3.geo.path();
      var svg = d3.select(_leaflet_map_handler.map.getPanes().overlayPane)
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height),
          g = svg.append('g').attr('class', 'leaflet-zoom-hide');

      // colors map
      // var svg_colors_map = d3.select('div#tweets_distribution_map')
      //                       .append('svg')
      //                       .attr('class', 'div#colors_map')
      //                       .attr('width', 200)
      //                       .attr('height', 270)
      //                       .style('z-index', 10000000)
      //                       .style('right', '-500px')
      //                       .style('top', '0px')
      //                       .style('padding', '10px')
      //                       .style('background-color', 'rgba(255,255,255,.8)');

      // var color_ary = ['#ccfef8', '#b4fcf6', '#b4f6fc', '#86e8f1', '#5dd8e3', '#4ac7f5', '#4aa7f5', '#248ce4', '#1a70b8', '#085393'];
      // var colors = d3.scale.ordinal().range(color_ary.reverse());
      // var tweet_legend = ['0~10%','10%~20%','20%~30%', '30%~40%', '40%~50%', '50%~60%', '60%~70%', '70%~80%', '80%~90%', '90%~100%'];

      // // append legend title
      // svg_colors_map.append("g")
      //     .append("text")
      //     .style("font-size", "14")
      //     .style("font-weight", "bold")
      //     .style("line-height", "30")
      //     .attr("width", 200)
      //     .text("Tweets Distribution")
      //     .attr("transform", function() {
      //             return "translate(10, 10)";
      //         });

      // // append legend
      // var legend = svg_colors_map.selectAll(".legend")
      //                 .data(tweet_legend.slice().reverse())
      //                 .enter()
      //                 .append("g")
      //                 .attr("class", "legend")
      //                 .attr("transform", function(d, i) {
      //                         return "translate(-600," + (i + 1) * 20 + ")";
      //                     });

      // legend.append("rect")
      //       .attr("x", width - 18)
      //       .attr("width", 18)
      //       .attr("height", 18)
      //       .style("fill", colors);
        
      // legend.append("text")
      //     .attr("x", width - 24)
      //     .attr("y", 9)
      //     .attr("dy", ".35em")
      //     .style("font-size","12px")
      //     .style("text-anchor", "end")
      //     .text(function(d) {
      //             return d;
      //         });

      // console.log(arg_tweets_geo_info.tweets);
      d3.csv('/public/files/id_country.csv', function(err, csv_to_json_data){
        // csv to json
        csv_to_json_data.forEach(function(elem, index){
          //
          tweets_geo_location[elem.id] = {name: elem.name};
        });

        d3.json('/public/files/countries_geo.json', function(err, arg_country_code_data){
          // console.log(arg_country_code_data.features);
          var collection = arg_country_code_data,
              temp_collection = { type: "FeatureCollection", features: [] };

          // loop through and update data set
          var total_count = 0, max_count = 0;
          collection.features.forEach(function(elem, index){
            //
            // console.log(elem.id);
            // console.log(arg_tweets_geo_info.tweets);
            // console.log('=================================');
            if(tweets_geo_location.hasOwnProperty(elem.id) &&
              arg_tweets_geo_info.tweets[elem.id]){
              //
              var avg_lat = 0, avg_lng = 0;
              elem.geometry.coordinates[0].forEach(function(geo_info, index){
                //
                avg_lat += Number(geo_info[1]);
                avg_lng += Number(geo_info[0]);
              });
              avg_lat = (avg_lat / elem.geometry.coordinates[0].length).toFixed(5);
              avg_lng = (avg_lng / elem.geometry.coordinates[0].length).toFixed(5);

              //
              if(tweets_geo_location[elem.id].hasOwnProperty('lat_lng_ary')){
                //
                tweets_geo_location[elem.id]['lat_lng_ary'].push({'lat': avg_lat, 'lng': avg_lng});
              }else{
                //
                tweets_geo_location[elem.id]['lat_lng_ary'] = [];
                tweets_geo_location[elem.id]['lat_lng_ary'].push({'lat': avg_lat, 'lng': avg_lng});
              }

              //
              var data_set = tweets_geo_location[elem.id];
              data_set['country_id'] = elem.id;
              data_set['count'] = arg_tweets_geo_info.tweets[elem.id]['count'];
              total_count += arg_tweets_geo_info.tweets[elem.id]['count'];
              if( arg_tweets_geo_info.tweets[elem.id]['count'] > max_count) max_count = arg_tweets_geo_info.tweets[elem.id]['count'];
              elem['tweets_geo_location'] = data_set;
              temp_collection.features.push(elem);
            }
          });

          // console.log(max_count);
          // console.log(temp_collection);
          collection = temp_collection;
          var transform = d3.geo.transform({point: projectPoint}),
              path = d3.geo.path().projection(transform);

          var feature = g.selectAll('path')
                        .data(collection.features)
                        .enter()
                        .append('path')
                        .attr('class', 'geo_path')
                        .style('fill', function(d){
                          //
                          var color_key = Math.floor(d.tweets_geo_location.count / max_count * 10) * 10;
                          return colors_map[color_key.toString()];
                        })
                        .on("mouseover", function(d) {
                                tip_div.transition()        
                                    .duration(200)
                                    .style("opacity", .95);      
                                tip_div.html('<div>' +
                                        '<strong>&nbsp;Country:&nbsp;' + d.tweets_geo_location.name + '</strong><br>' +
                                        '</div>')  
                                      .style("left", (d3.event.pageX - 10) + "px")     
                                      .style("top", (d3.event.pageY - 10) + "px");    
                        })                  
                        .on("mouseout", function(d) {       
                            tip_div.transition()        
                                  .duration(300)      
                                  .style("opacity", 0);   
                        });

          // Reposition the SVG to cover the features.
          function reset() {
              var bounds = path.bounds(collection),
                          topLeft = bounds[0],
                          bottomRight = bounds[1];

                  svg.attr("width", bottomRight[0] - topLeft[0])
                      .attr("height", bottomRight[1] - topLeft[1])
                      .style("left", topLeft[0] + "px")
                      .style("top", topLeft[1] + "px");

                  g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

              feature.attr("d", path);
          }

          // Use Leaflet to implement a D3 geometric transformation.
          function projectPoint(x, y) {
              var point = _leaflet_map_handler.map.latLngToLayerPoint(new L.LatLng(y, x));
              this.stream.point(point.x, point.y);
          }

          _leaflet_map_handler.map.on("viewreset", reset);
          reset();
        });
      });
    }
  }

  // start analysis
  window.twitter_analysis_handler.get_analysis_collection();

  window.twitter_analysis_handler.get_twitter_tweets();

  window.twitter_analysis_handler.get_tweets_keywords();

  window.twitter_analysis_handler.get_tweet_geo_info();
  /* end */

})(jQuery);
