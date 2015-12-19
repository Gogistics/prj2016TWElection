module.exports = function(io, streams) {
  // build connection when a new client joins
  io.on('connection', function(client) {
    console.log('-- ' + client.id + ' joined --');
    client.emit('id', client.id);
    client.on('message', function (details) {
      var otherClient = io.sockets.connected[details.to];
      if (!otherClient) {
        return;
      }
        delete details.to;
        details.from = client.id;
        otherClient.emit('message', details);
    });
      
    // receive notification when stream is ready
    client.on('readyToStream', function(options) {
      console.log('-- ' + client.id + ' is ready to stream --');
      streams.addStream(client.id, options.name, options.user_type);

      // send notification to all users when new stream coming; notify user-self & need to notify other users
      // client.emit('new_stream_notification', 'stream_on')
      notify_users_to_update_streams_info('stream_on', client.id);
    });
    
    // update stream info.
    client.on('update', function(options) {
      streams.update(client.id, options.name);
    });

    function leave() {
      console.log('-- ' + client.id + ' left --');
      streams.removeStream(client.id);

      // send notification to all users when stream leaves
      // client.emit('new_stream_notification', 'stream_off');
      notify_users_to_update_streams_info('stream_off', client.id);
    }

    function notify_users_to_update_streams_info(arg_notification_key, arg_client_id_from){
      var clients = io.sockets.connected;
      if(!clients || clients.length === 0){
        return false;
      }
      for(var key in clients){
        console.log('socket-key: ' + key);
        clients[key].emit('stream_notification', { notification_key: arg_notification_key, client_id_from: arg_client_id_from });
      }
    }

    client.on('disconnect', leave);
    client.on('leave', leave);
  });
};