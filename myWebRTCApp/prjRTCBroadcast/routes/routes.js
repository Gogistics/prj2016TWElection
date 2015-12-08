module.exports = function(app, streams) {

  // GET home 
  var index = function(req, res) {
    res.render('index.jade', { title: 'WebRTC', 
                          header: 'Customer Service',
                          username: 'Username/Room Tag',
                          share: 'Share this link',
                          footer: 'alan.tai@fund364.com',
                          id: req.params.id
                        });
  };

  // GET streams as JSON
  var display_streams = function(req, res) {
    var stream_list = streams.getStreams();
    // JSON exploit to clone stream_list.public
    var data = (JSON.parse(JSON.stringify(stream_list))); 

    res.status(200).json(data);
  };

  app.get('/streams.json', display_streams);
  app.get('/', index);
  app.get('/:id', index);
}