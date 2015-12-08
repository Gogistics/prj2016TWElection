module.exports = function(app, streams) {

  // GET home 
  var index = function(req, res) {
    res.render('index.jade', { title: 'WebRTC', 
                          header: 'WebRTC Broadcast Streaming',
                          username: 'John Dow',
                          share: 'Share this link',
                          footer: 'gogistics@gogistics-tw.com',
                          id: req.params.id
                        });
  };

  // GET streams as JSON
  var displayStreams = function(req, res) {
    var streamList = streams.getStreams();
    // JSON exploit to clone streamList.public
    var data = (JSON.parse(JSON.stringify(streamList))); 

    res.status(200).json(data);
  };

  app.get('/streams.json', displayStreams);
  app.get('/', index);
  app.get('/:id', index);
}