module.exports = function(app, streams) {
  var cryptoJS = require('crypto-js'),
      login_info_for_service = {'pwd': 'ilovetaiwan'},
      login_info_for_user = { 'pwd': 'iamtaiwanese'},
      template_dict = { voting_station: 'service_index.jade',
                        regular_user: 'user_index.jade'},
      title_title = { voting_station: 'Voting Station',
                      regular_user: 'Regular User'};

  /* MongoDB connection */
  var monk = require('monk'),
      url = process.env.MONGODB_USER + ':' process.env.MONGODB_USER_PWD + '@' + process.env.MONGODB_INSTANCE_DNS + ':27017/test',
      db = monk(url),
      streams_collection = db.get('streams_collection');

  // GET login
  var login = function(req, res) {
    var is_user_info_existing = "".hasOwnProperty.call(req.cookies, "user_info"); // temp. solution
    if(is_user_info_existing){
      res.redirect('/');
    }else{
      var vars = { title: 'WebRTC', 
                  header: 'WebRTC Broadcast Service',
                  username: 'Username/Room Tag',
                  share: 'Share this link',
                  footer: 'gogistics@gogistics-tw.com',
                  id: req.params.id };

      res.render('login.jade', vars);
    }
  };

  // GET home 
  var index = function(req, res) {
    var user_type = req.params.id,
        template_index = 'user_index.jade';
    var vars = { title: 'WebRTC',
                header: 'Viewer',
                username: 'Username/Room Tag',
                share: 'Share this link',
                footer: 'gogistics@gogistics-tw.com',
                id: req.params.id};
    if(user_type === undefined || user_type === 'voting_station'){
      //
      vars['header'] = 'Voting Station';
      template_index = 'service_index.jade';
    }else if(user_type === 'viewer'){
      //
      vars['header'] = 'Viewer';
      template_index = 'user_index.jade';
    }
    res.render(template_index, vars);
  };
  var recording = function(req, res){
    //
    res.render('recording_1.jade', {});
  }
  app.get('/recording', recording);

  // GET streams as JSON
  var display_streams = function(req, res) {
      streams_collection
      .find({}, function(err, docs){
        res.status(200).json(docs);
      });
  };

  /* post */
  var verify_login_info = function(req, res){
    //
    var login_info = req.body.login_info,
    user_pwd = login_info.pwd,
    user_type = login_info.user_type,
    hash_key_pwd = cryptoJS.SHA256(user_pwd).toString(cryptoJS.enc.Hex), // dea73b12c42903b03e05e161a05f58d7aaefe7cbcf8b65fd74951df70c0f5716
    token_pwd = cryptoJS.HmacSHA1(user_type, hash_key_pwd).toString(cryptoJS.enc.Hex), // 0b2dccbd5409976db1ff3c2b7ce006bc42f90f42
    user_ip = req.connection.remoteAddress;

    var vars;
    if( user_type === 'voting_station'){
      //
      vars = { is_info_valid: true };
      res.cookie('user_info', {token: token_pwd, user_type: user_type}, { maxAge: 200000, httpOnly: true});
    }else if( user_type === 'regular_user'){
      //
      vars = { is_info_valid: true };
      res.cookie('user_info', {token: token_pwd, user_type: user_type}, { maxAge: 200000, httpOnly: true});
    }else{
      vars = { is_info_valid: false };
    }
    res.send(vars);
  }

  app.get('/logout', function(req, res){
    // clear cookie
    console.log(req.cookies);
    res.clearCookie('user_info');
    res.redirect('/login');
  })

  // get stream info. in JSON
  app.get('/streams.json', display_streams);

  // login route
  app.get('/login', login);

  // index
  app.get('/', index);
  app.get('/:id', index);

  //
  app.post('/verify_login_info', verify_login_info);
}