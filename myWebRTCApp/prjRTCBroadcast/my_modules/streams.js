module.exports = function() {
  /*
  * MongoDB Config. (testing)
  */
  var monk = require('monk'),
      url = 'test_user:shardingexample@52.34.42.178:27017/test',
      db = monk(url),
      streams_collection = db.get('streams_collection'),
      stream_logs_collection = db.get('stream_logs_collection');
  /**
   * available streams 
   * the id value is considered unique (provided by socket.io)
   */
  var stream_list = [];

  /**
   * Stream object; will be replaced as a document stored in MongoDB
   */
  var Stream = function(id, name, user_type) {
    this.name = name;
    this.id = id;
    this.user_type = user_type;
    this.selected_voting_station = ''; // selected_voting_station for regular_user
  }

  /* return streams obj */
  return {
    // add stream
    addStream : function(id, name, user_type) {
      var stream = new Stream(id, name, user_type);
      stream_list.push(stream);

      // new function of adding stream to MongoDB
      streams_collection.insert(stream, function(err, doc){
        // successfully store stream doc to MongoDB
        if(!err){
          console.log('successfully store stream to MongoDB...');
        }
      });
    },

    // remove stream
    removeStream : function(id) {
      var index = 0;
      while(index < stream_list.length && stream_list[index].id != id){
        index++;
      }
      stream_list.splice(index, 1);

      // new function of removing document (testing)
      streams_collection.remove({id: id}, function(err){
        // if error exists, show error
        if(!err){
          console.log('successfully remove document from MongoDB...');
        }
      });
    },

    // update name of stream
    update : function(id, name) {
      var stream = stream_list.find(function(element, i, array) {
        return element.id == id;
      });
      stream.name = name;

      // new function of updating document (testing)
      streams_collection.update({id: id}, {$set: {name: name}}, function(err, updated_doc){
        // if no error, show doc
        if(!err) console.log(updated_doc);
      });
    },

    // get streams list
    getStreams : function() {
      var new_streams_list = [];
      streams_collection
      .find({}, {stream: true})
      .each(function(doc){
        new_streams_list.push(doc);
      })
      .error(function(err){
        if(err) console.log(err);
      })
      .success(function(){
        //
        return new_streams_list;
      });
      // return stream_list;
    },

    //  new functions for MongoDB (testing)
    getStreamsList: function(){
      // update streams list of container based on the data from MongoDB
      var new_streams_list = [];
      streams_collection
      .find({}, {stream: true})
      .each(function(doc){
        new_streams_list.push(doc);
      })
      .error(function(err){
        if(err) console.log(err);
      })
      .success(function(){
        //
        return new_streams_list;
      });
    },
  }
};
