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
    }
  }

  // start analysis
  window.twitter_analysis_handler.get_analysis_collection();

  window.twitter_analysis_handler.get_twitter_tweets();

  window.twitter_analysis_handler.get_tweets_keywords();
  /* end */

})(jQuery);
