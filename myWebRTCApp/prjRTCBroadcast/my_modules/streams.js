module.exports = function() {
  /*
  * MongoDB Config. (testing)
  */
  var monk = require('monk'),
      url = process.env.MONGODB_USER + ':' process.env.MONGODB_USER_PWD + '@' + process.env.MONGODB_INSTANCE_DNS + ':27017/test',
      db = monk(url),
      streams_collection = db.get('streams_collection'),
      stream_logs_collection = db.get('stream_logs_collection');

  /**
   * Stream object; will be replaced as a document stored in MongoDB
   */
  var Stream = function(id, name, user_type) {
    this.name = name;
    this.id = id;
    this.user_type = user_type;
  }
  var VotingStationStream = function(arg_id, arg_name, arg_user_type){
    //
    Stream.call(this, arg_id, arg_name, arg_user_type);
    this.viewers = [];
  }
  VotingStationStream.prototype = Object.create(Stream.prototype);
  VotingStationStream.prototype.constructor = VotingStationStream;
  var ViewerStream = function(arg_id, arg_name, arg_user_type){
    //
    Stream.call(this, arg_id, arg_name, arg_user_type);
    this.selected_voting_station = []; // selected_voting_station for regular_user
  }
  ViewerStream.prototype = Object.create(Stream.prototype);
  ViewerStream.prototype.constructor = ViewerStream;

  /* return streams obj */
  return {
    // add stream
    addStream : function(id, name, user_type) {
      var stream = new Stream(id, name, user_type);

      // new function of adding stream to MongoDB
      streams_collection.insert(stream, function(err, doc){
        // successfully store stream doc to MongoDB
        if(!err){
          console.log('successfully store stream into MongoDB...');
        }
      });
    },

    // remove stream
    removeStream : function(id) {
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
      // new function of updating document (testing)
      streams_collection.update({id: id}, {$set: {name: name}}, function(err, updated_doc){
        // if no error, show doc
        if(!err) console.log(updated_doc);
      });
    },

    // get streams list; may be unnecessary for using cloud db
    getStreams : function() {
      streams_collection
      .find({}, function(err, docs){
        if(!err){
          return docs;
        }else{
          return {status: 'something wrong'};
        }
      });
    }
  }
};
