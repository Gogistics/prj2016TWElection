/**/
'use strict';
(function($){
  //
  new WOW().init();
  jQuery(window).load(function() { 
    jQuery("#preloader").delay(100).fadeOut("slow");
    jQuery("#load").delay(100).fadeOut("slow");
  });

  //
  function Trie(parent, prev, key, value) {
    if (key !== void 0)
        this.key = key;      // single-character key
    if (value !== void 0)
        this.value = value;  // user-defined value
    if (prev)
        prev.next = this;    // next sibling node
    else if (parent)
        parent.child = this; // first child node
  }

  // put a key/value pair in the trie
  Trie.prototype.put = function(name, value) {
      var i = 0, t = this, len = name.length, prev, parent;
      down: while (t.child) {
          parent = t;
          t = t.child;
          // if first child didn't match, get next sibling
          while (t.key != name[i]) {
              if (!t.next) {
                  prev = t;
                  t = parent;
                  break down;
              }
              t = t.next;
          }
          // key already exists, update the value
          if (++i > len) {
              t.value = value;
              return;
          }
      }
      // found any existing parts of the key, add the rest
      t = new this.constructor(t, prev, name[i]);
      while (++i <= len)
          t = new this.constructor(t, null, name[i]);
      t.name = name;
      t.value = value;
  };

  // get a value from the trie at the given key
  Trie.prototype.get = function(name) {
      var i = 0, t = this.child, len = name.length;
      while (t) {
          if (t.key == name[i]) {
              if (i == len)
                  return t.value;
              t = t.child;
              ++i;
          } else {
              t = t.next;
          }
      }
  };

  // --------

  /* Trie D3 */
  // TrieD3 extends Trie with a "children" property for each node,
  // which d3 uses to build a diagram.
  function TrieD3(parent) {
      if (parent) {
          if (parent.children)
              parent.children.push(this);
          else
              parent.children = [this];
      }
      Trie.apply(this, arguments);
  }
  TrieD3.prototype = Object.create(Trie.prototype);
  TrieD3.prototype.constructor = TrieD3;

  var dict = new TrieD3();

  //data set
  dict.put("恐怖","nail");
  dict.put("恐怖攻擊", "nail");
  dict.put("網友", "nail");
  dict.put("歡迎光臨", "nail");
  dict.put("歡迎", "nail");
  dict.put("全新體驗", "head");
  dict.put("資訊", "head");
  dict.put("民主", "head");
  dict.put("網上資源", "nail");
  dict.put("truck", "婦女基金會");
  dict.put("hammer", "nail");
  dict.put("halt", "hold it");

  // d3 stuff
  var width = 800,
      height = 800;

  var cluster = d3.layout.cluster()
      .size([height, width - 100])

  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; })

  var svg = d3.select("div#text_analysis").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(10,0)")

  var root = dict,
      nodes = cluster.nodes(root),
      links = cluster.links(nodes);

  var link = svg.selectAll(".link")
      .data(links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  var node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
          return "translate(" + d.y + "," + d.x + ")"; 
      });

  node.append("circle")
      .attr("r", function(d) { 
          return !d.parent ? 8 : d.children ? 15 : 8; 
      })
      .attr("class", function(d) { 
          return !d.parent ? "root" : d.children ? "branch" : "leaf"; 
      })
      .on("click", function(d){
        alert(d.value);
      });

  node.append("text")
      .attr("dx", function(d){return -5 })
      .attr("dy", function(d){return 5 })
      .text(function(d){ return d.key; })

  node.append("text")
      .attr("dx", function(d) { return d.children ? 0 : 16; })
      .attr("dy", 3)
      .text(function(d) { return d.name })

  d3.select(self.frameElement).style("height", height + "px");
  
})(jQuery);