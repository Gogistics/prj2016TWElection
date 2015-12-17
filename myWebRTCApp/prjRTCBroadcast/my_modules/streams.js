module.exports = function() {
  /**
   * available streams 
   * the id value is considered unique (provided by socket.io)
   */
  var stream_list = [];

  /**
   * Stream object
   */
  var Stream = function(id, name, user_type) {
    this.name = name;
    this.id = id;
    this.user_type = user_type;
    this.selected_voting_station = ''; // selected_voting_station for regular_user
  }

  return {
    // add stream
    addStream : function(id, name, user_type) {
      var stream = new Stream(id, name, user_type);
      stream_list.push(stream);
    },

    // remove stream
    removeStream : function(id) {
      var index = 0;
      while(index < stream_list.length && stream_list[index].id != id){
        index++;
      }
      stream_list.splice(index, 1);
    },

    // update name of stream
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
