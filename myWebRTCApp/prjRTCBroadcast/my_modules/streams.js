module.exports = function() {
  /**
   * available streams 
   * the id value is considered unique (provided by socket.io)
   */
  var stream_list = [];

  /**
   * Stream object
   */
  var Stream = function(id, name) {
    this.name = name;
    this.id = id;
    this.user_type = '';
    this.selected_voting_station = ''; // selected_voting_station for regular_user
  }

  return {
    addStream : function(id, name) {
      var stream = new Stream(id, name);
      stream_list.push(stream);
    },

    removeStream : function(id) {
      var index = 0;
      while(index < stream_list.length && stream_list[index].id != id){
        index++;
      }
      stream_list.splice(index, 1);
    },

    // update function
    update : function(id, name) {
      var stream = stream_list.find(function(element, i, array) {
        return element.id == id;
      });
      stream.name = name;
    },

    getStreams : function() {
      return stream_list;
    }
  }
};
