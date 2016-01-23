/* twitter */
'use strict';
(function($) {
  /* facebook handler */
  window.facebook_analysis_handler = window.facebook_analysis_handler || {
    get_analysis_collection : function(){
      // create an AJAX call to get data
      $.ajax({
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
                  console.log('fail and no data come in...');
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
            new_replaced_str = arg_collection[ith_key]['data'][0]['message'] || '...',
            post_picture = arg_collection[ith_key]['data'][0]['picture'] || '/public/frontend_1/img/team/alan_tai.png';

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
        var _elem = $('#' + politicians_dict[ith_key]);
        _elem.append( '<div class="post_message">' +
                      '<strong style="font-size: 10px; font-weight: bold;">Latest Post</strong>' + '<br/>' +
                      '<strong style="font-size: 10px;">Shares:&nbsp;' + shares_count + '</strong>' + '<br/>' +
                      '<strong style="font-size: 10px;">' + ( new Date(arg_collection[ith_key]['data'][0]['created_time']) ) + '</strong>' +
                      '<img src="' + post_picture + '" class="img-responsive"/>' +
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
        if((new Date(arg_data[ith_key]['created_time']).getTime()) < (new Date('2015-10-30').getTime())){
          //
          continue;
        }
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

        // mouseover event
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
                    '<strong style="font-size: 10px; font-weight: bold;">Post with highest shares</strong>' + '<br/>' +
                    '<strong style="font-size: 10px;">Shares:&nbsp;' + post_info_with_heighest_shares.count + '</strong>' + '<br/>' +
                    '<strong style="font-size: 10px;">' + ( new Date(post_info_with_heighest_shares.date) ) + '</strong>' +
                    '<p style="font-size: 12px; margin-top: 10px;">' + replaced_string + '</p>' +
                    '</div>' +
                    '<a href="' + post_info_with_heighest_shares.link + '" target="_blank">Post Link</a><hr/>');
    },
    get_fb_latest_posts: function(){
      // create an AJAX call to get data
      var _this = this;
      $.ajax({
          data: {
            token: 'OCweKSaVwPOgerGEhRAEBvsRNdqWEdjA',
          },
          type: 'POST', // GET or POST
          url: '/services/get_fb_latest_posts', // the file to call
          success: function(res) {
              // console.log(res.collection);
              if(res.request_status === 'successful'){
                  _this.build_summary_chart(res.collection);
              }else{
                  console.log('fail and no data come in...');
              };
          }
      });
    },
    build_summary_chart: function(arg_collection){
      // set collection
      var tsai_ing_wen_posts = arg_collection['tsaiingwen'],
          eric_chu_posts = arg_collection['llchu'],
          james_soong_posts =arg_collection['love4tw'];

      // convert obj to ary
      var max_shares_count = 0;
      var convert_obj_to_ary = function(arg_collection){
        var ary = [];
        for(var ith_key in arg_collection){
          //
          var date = new Date(arg_collection[ith_key]['created_time']);
          if( date.getTime() > (new Date('2015-10-30').getTime()) ){
            //
            arg_collection[ith_key]['created_time'] = date;
            ary.push(arg_collection[ith_key]);
          }
        }
        return ary;
      }
      tsai_ing_wen_posts = convert_obj_to_ary(tsai_ing_wen_posts);
      tsai_ing_wen_posts.sort(function(a,b){ return (a.created_time - b.created_time); });
      // console.log(tsai_ing_wen_posts);
      eric_chu_posts = convert_obj_to_ary(eric_chu_posts);
      eric_chu_posts.sort(function(a,b){ return (a.created_time - b.created_time); });
      // console.log(eric_chu_posts);
      james_soong_posts = convert_obj_to_ary(james_soong_posts);
      james_soong_posts.sort(function(a,b){ return (a.created_time - b.created_time); });
      // console.log(james_soong_posts);

      /* D3 */
      var margin = {top: 80, right: 0, bottom: 30, left: 60},
                    width = 500 - margin.left - margin.right,
                    height = 400 - margin.top - margin.bottom;

      var x = d3.time.scale().range([0, width]);
      var y0 = d3.scale.linear().range([height, 0]);

      var xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(7);

      var yAxisLeft = d3.svg.axis().scale(y0)
          .orient("left").ticks(10,"s");

      var valueline = d3.svg.line()
                      .x(function(d) { return x(d.created_time); })
                      .y(function(d) { if(d.shares && d.shares.count >=0){ return y0(d.shares.count); }else{ return y0(0);} });

      var svg = d3.select("div#fb_summary_chart")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // make grid
      var make_y_axis = function() {        
          return d3.svg.axis()
                  .scale(y0)
                  .orient("left")
                  .ticks(5);
      }

      svg.append("svg:g")         
          .attr("class", "grid")
          .call(make_y_axis().tickSize(-width, 0, 0).tickFormat( "" ));


      // pre-defined date ary
      var dateArray = d3.time
                      .scale()
                      .domain([new Date(2015, 9, 30), new Date(2016, 1, 10)])
                      .ticks(d3.time.days, 1);

      // set domain range
      x.domain([new Date(2015, 9, 30), new Date(2016, 1, 10)]);
      y0.domain([0, 10000]);

      // add lines
      svg.append("path")        // Add the valueline path.
         .attr("class", "line_tsai")
         .attr("d", valueline(tsai_ing_wen_posts));

      svg.append("path")        // Add the valueline path.
         .attr("class", "line_ericchu")
         .attr("d", valueline(eric_chu_posts));
         
      svg.append("path")        // Add the valueline path.
         .attr("class", "line_jamessoong")
         .attr("d", valueline(james_soong_posts));   

      svg.append("g")            // Add the X Axis
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .style("font-size", 9)
          .call(xAxis);
      
      svg.append("g")
          .attr("class", "y axis")
          .style("fill", "#c79825")
          .call(yAxisLeft);

      // add title
      svg.append("text")
        .attr("class", "title")
        .attr("x", width/2)
        .attr("y", -(margin.top / 2) - 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .style("font-size", 20)
        .text("Trend of Shares Count of Each Candidate");

      svg.append("g")
        .attr("class", "y axis")
        .style("fill", "#c79825")
        .call(yAxisLeft)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".4em")
        .style("text-anchor", "end")
        .attr("font-size", "16px")
        .style("font-size", 16)
        .text("Shares");

        // add legend
        var data_set = ['tsaiingwen', 'llchu', 'love4tw'],
            color_hash = { 'tsaiingwen': { name: '蔡英文', color: '#21a607' },
                          'llchu': { name: '朱立倫', color: '#0c0cfb'},
                          'love4tw': { name: '宋楚瑜', color: '#fb990c'} };
        var legend = svg.append("g")
                        .attr("class", "legend")
                        .attr("x", width - 15)
                        .attr("y", 20)
                        .attr("height", 100)
                        .attr("width", 100)
                        .attr('transform', 'translate(15,20)');
        legend.selectAll('rect')
              .data(data_set)
              .enter()
              .append("rect")
              .attr("x", width - 65)
              .attr("y", function(d, i){ return i *  20;})
              .attr("width", 10)
              .attr("height", 10)
              .style("fill", function(d) {
                // console.log('legend-color: ' + d);
                var color = color_hash[d]['color'];
                return color;
              });
        legend.selectAll('text')
              .data(data_set)
              .enter()
              .append("text")
              .attr("x", width - 52)
              .attr("y", function(d, i){ return i *  20 + 9;})
              .text(function(d) {
                // console.log('legend-name: ' + d);
                var text = color_hash[d]['name'];
                return text;
              });
    },
    get_fb_posts_summarized_keywords_set: function(){
      // create an AJAX call to get data
      var _this = this;
      $.ajax({
          data: {
            token: 'OCweKSaVwPOgerGEhRAEBvsRNdqWEdjA',
          },
          type: 'POST', // GET or POST
          url: '/services/get_fb_posts_summarized_keywords_set', // the file to call
          success: function(res) {
              if(res.request_status === 'successful'){
                  // console.log(res.keywords_set);
                  _this.build_chart_keywords_set(res.keywords_set);
              }else{
                  console.log('fail and no data come in...');
              };
          }
      });
    },
    build_chart_keywords_set: function(arg_keywords_set){
      // for loop
      var links = [],
          candidates = { tsaiingwen: '蔡英文-2',
                        llchu: '朱立倫-1',
                        love4tw: '宋楚瑜-3'};
      for(var ith in arg_keywords_set){
        // sorting
        arg_keywords_set[ith]['filtered_keywords'].sort(function(a,b){ return (b.count - a.count); });
        var top_5  = arg_keywords_set[ith]['filtered_keywords'].slice(0, 7);
        var count = 0;
        for(var jth in top_5){
          var type = (count < 3) ? ('top_3_' + ith) : ('top_5_' + ith);
          links.push({source: candidates[ith], target: top_5[jth]['word'], type: type, candidate_key: ith});
          count++;
        }
      }

      // nodes
      var nodes = {};

      // Compute the distinct nodes from the links.
      links.forEach(function(link) {
        if(nodes[link.target]) nodes[link.target].candidate_key = 'shared_keyword';
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, candidate_key: link.candidate_key});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, candidate_key: link.candidate_key});
      });

      var width = 500,
          height = 500;

      var force = d3.layout.force()
          .nodes(d3.values(nodes))
          .links(links)
          .size([width, height])
          .linkDistance(100)
          .charge(-300)
          .on("tick", tick)
          .start();
      // console.log(nodes);

      var svg = d3.select("div#fb_top_keywords_relationship").append("svg")
          .attr("width", width)
          .attr("height", height);

      // Per-type markers, as they don't inherit styles.
      svg.append("defs").selectAll("marker")
          .data(["top_3_tsaiingwen", "top_3_llchu", "top_3_love4tw"])
          .enter().append("marker")
          .attr("id", function(d) { return d; })
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 15)
          .attr("refY", -1.5)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", "auto")
          .append("path")
          .attr("d", "M0,-5L10,0L0,5");

      var path = svg.append("g").selectAll("path")
          .data(force.links())
          .enter().append("path")
          .attr("class", function(d) { return "link " + d.type; })
          .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

      var circle = svg.append("g").selectAll("circle")
          .data(force.nodes())
          .enter().append("circle")
          .attr("r", 6)
          .attr("class", function(d){ return d.candidate_key; })
          .call(force.drag);

      var text = svg.append("g")
          .selectAll("text")
          .data(force.nodes())
          .enter().append("text")
          .attr('class', 'links_text')
          .attr("x", 10)
          .attr("y", ".35em")
          .text(function(d) { return d.name; });

      // add title
      svg.append("text")
        .attr("class", "title")
        .attr("x", width/2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .style("font-size", 20)
        .text("Keywords Analysis");

      // Use elliptical arc path segments to doubly-encode directionality.
      function tick() {
        path.attr("d", linkArc);
        circle.attr("transform", transform);
        text.attr("transform", transform);
      }

      function linkArc(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      }

      function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
      }
    }
  }
  // get fb latest posts
  window.facebook_analysis_handler.get_fb_latest_posts();

  // get analysis collections
  window.facebook_analysis_handler.get_analysis_collection();

  //
  window.facebook_analysis_handler.get_fb_posts_summarized_keywords_set();
})(jQuery);
