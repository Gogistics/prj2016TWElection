(function($){
  'use strict';
  var app = angular.module('myWebRTC', [], function($locationProvider){$locationProvider.html5Mode(true);});
  var client = new PeerManager();
  var mediaConfig = {
        audio:true,
        video: {
          mandatory: {},
          optional: []
        }
    };

  /* ng-value */
  app.value('DICT',{
    EMAIL_TECHNICAL_SUPPORT : 'alan.tai@fund364.com'
  });

  app.controller('IndexController', ['$window', '$location', function($window, $location){
    //
    var ctrl = this;
  }]);

  app.controller('RemoteStreamsController', ['$location', '$http', '$window', function($location, $http, $window){
    var rtc = this;
    rtc.remoteStreams = [];
    function getStreamById(id) {
        for(var i=0; i<rtc.remoteStreams.length;i++) {
          if (rtc.remoteStreams[i].id === id) {return rtc.remoteStreams[i];}
        }
    }
    rtc.loadData = function () {
      // get list of streams from the server
      $http.get('/streams.json').success(function(data){
        // filter own stream
        var streams = data.filter(function(stream) {
              return stream.id != client.getId();
          });
          // get former state
          for(var i = 0; i < streams.length; i++) {
            var stream = getStreamById(streams[i].id);
            streams[i].isPlaying = (!!stream) ? stream.isPlaying : false;
          }
          // save new streams
          rtc.remoteStreams = streams;
          console.log('update stream list...');
      });
    };
    client.add_external_mechanism('load_data', rtc.loadData);

    // view remote stream
    rtc.view = function(stream){
      client.peerInit(stream.id);
      stream.isPlaying = !stream.isPlaying;
    };

    //initial load
    rtc.loadData();
  }]);

})(jQuery);