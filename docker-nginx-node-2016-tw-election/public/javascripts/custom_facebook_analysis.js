/* twitter */
(function ($) {
  /* Plurk Handler */
  window.facebook_analysis_handler = window.facebook_analysis_handler || {
    get_analysis_collection : function(){
      //
      $.ajax({ // create an AJAX call...
          data: {
            token: 'OCweKSaVwPOgerGEhRAEBvsRNdqWEdjA',
          },
          type: 'POST', // GET or POST
          url: '/services/get_facebook_latest_posts_analysis_collection', // the file to call
          success: function(res) {
              if(res.request_status === 'successful'){
                  // console.log(res.collecion);
                  window.facebook_analysis_handler.append_latest_post(res.collecion);
              }else{
                  console.log('fail...');
              };
          }
      });
    },
    append_latest_post : function(arg_collection){
      //
      var politicians_dict = {'tsaiingwen' : 'latest_post_tsaiingwen',
                              'llchu' : 'latest_post_llchu',
                              'love4tw' : 'latest_post_love4tw',
                              'MaYingjeou' : 'latest_post_MaYingjeou'};

        var shares_info = undefined, shares_count = 0;
      for(var ith_key in arg_collection){
        /* build chart */
        window.facebook_analysis_handler.build_shares_chart(politicians_dict[ith_key], arg_collection[ith_key]['data']);

        /* display summary info */
        var truncated_length = 100,
            new_replaced_str = arg_collection[ith_key]['data'][0]['message'];

        new_replaced_str = new_replaced_str.replace(/(http[s]*:[^\s]+)/gi, function(arg_link){
            return '<a href="' + arg_link + '" target="_blank">' + arg_link + '</a>';
        });

        //
        shares_info = undefined, shares_count = 0;
        if(arg_collection[ith_key]['data'][0].hasOwnProperty('shares')){
          //
          shares_info = arg_collection[ith_key]['data'][0]['shares'];
          shares_count = shares_info['count'];
        }
        
        //
        _elem = $('#' + politicians_dict[ith_key]);
        _elem.append( '<div class="post_message">' +
                      '<strong style="font-size: 10px; font-weight: bold;">Latest Post</strong>' + '<br/>' +
                      '<strong style="font-size: 10px;">Shares:&nbsp;' + shares_count + '</strong>' + '<br/>' +
                      '<strong style="font-size: 10px;">' + ( new Date(arg_collection[ith_key]['data'][0]['created_time']) ) + '</strong>' +
                      '<p style="font-size: 12px; margin-top: 10px;">' + new_replaced_str + '</p>' +
                      '</div>' +
                      '<a href="' + arg_collection[ith_key]['data'][0]['link'] + '" target="_blank">Post Link</a>');
      }
    },
    build_shares_chart : function(arg_elem_id, arg_data){
      //
      var shares_info_ary = [], post_info_with_heighest_shares = { count : 0, date : '', message : '', link : '' };
      for(var ith_key in arg_data){
        //
        var shares_count = arg_data[ith_key].hasOwnProperty('shares') ? arg_data[ith_key]['shares']['count'] : 0;
        shares_info_ary.push({ date : ( new Date(arg_data[ith_key]['created_time']) ), value: shares_count});

        if( shares_count >= post_info_with_heighest_shares.count ){
          //
          post_info_with_heighest_shares.count = shares_count;
          post_info_with_heighest_shares.date = arg_data[ith_key]['created_time'];
          post_info_with_heighest_shares.message = arg_data[ith_key]['message'];
          post_info_with_heighest_shares.link = arg_data[ith_key]['link'];
        }
      }
      shares_info_ary.reverse();

      /* d3 */
      var margin = {top: 30, right: 30, bottom: 30, left: 30},
                    width = 200 - margin.left - margin.right,
                    height = 100 - margin.top - margin.bottom;

      var x = d3.time.scale().range([0, width]);
      var y0 = d3.scale.linear().range([height, 0]);

      var xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(2);

      var yAxisLeft = d3.svg.axis().scale(y0)
          .orient("left").ticks(3, "s");

      var valueline = d3.svg.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y0(d.value); });
          
      var svg = d3.select("div#" + arg_elem_id)
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");

      // append title
      svg.append("text")
      .attr("class", "d3_title")
      .attr("x", width/2)
      .attr("y", 0 - (margin.top / 2) - 5)
      .attr("text-anchor", "middle")
      .text("Shares of Latest 25 Posts");

      /* make grid */
      function make_y_axis() {        
          return d3.svg.axis()
              .scale(y0)
              .orient("left")
              .ticks(5);
      }

      svg.append("svg:g")         
          .attr("class", "grid")
          .call(make_y_axis().tickSize(-width, 0, 0).tickFormat(""));

      x.domain(d3.extent(shares_info_ary, function(d) { return d.date; }));
        y0.domain([0, d3.max(shares_info_ary, function(d) {
            return Math.max(d.value); })]);

        svg.append("path")        // Add the valueline path.
           .attr("class", "line_1")
           .attr("d", valueline(shares_info_ary));

        svg.append("g")            // Add the X Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .style("font-size", 9)
            .call(xAxis);
        
        svg.append("g")
            .attr("class", "y axis")
            .style("fill", "#c79825")
            .call(yAxisLeft);

        // // mouseover event
        var bisectDate = d3.bisector(function(d) { return d.date; }).left,
            formatValue = d3.format("s"),
            formatShares = function(d) { return formatValue(d); };
        
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
                                i = bisectDate(shares_info_ary, x0, 1),
                                d0 = shares_info_ary[i - 1],
                                d1 = shares_info_ary[i];

                            if(d0 && d1){
                              var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                              div.transition()        
                                  .duration(200)
                                  .style("opacity", .9);      
                              div.html('<div><strong>Date:&nbsp;' + d.date.toLocaleDateString() + '</strong><br/>' +
                                      '<p><label>Shares:&nbsp;</label>' + formatShares(d.value) + '</p>' +
                                      '</div>')  
                                    .style("left", (d3.event.pageX + 10) + "px")     
                                    .style("top", (d3.event.pageY - 10) + "px");
                            }
          });

      //
      
      var replaced_string = post_info_with_heighest_shares.message.replace(/(http[s]*:[^\s]+)/gi, function(arg_link){
            return '<a href="' + arg_link + '" target="_blank">' + arg_link + '</a>';
      });
      var _elem = $('#' + arg_elem_id);
      _elem.append( '<div class="post_message">' +
                    '<strong style="font-size: 10px; font-weight: bold;">Post with Heighest Shares</strong>' + '<br/>' +
                    '<strong style="font-size: 10px;">Shares:&nbsp;' + post_info_with_heighest_shares.count + '</strong>' + '<br/>' +
                    '<strong style="font-size: 10px;">' + ( new Date(post_info_with_heighest_shares.date) ) + '</strong>' +
                    '<p style="font-size: 12px; margin-top: 10px;">' + replaced_string + '</p>' +
                    '</div>' +
                    '<a href="' + post_info_with_heighest_shares.link + '" target="_blank">Post Link</a><hr/>');
    }
  }

  //
  window.facebook_analysis_handler.get_analysis_collection();

})(jQuery);
