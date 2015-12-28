(function($){
  'use strict';
  var app = angular.module('myWebRTC', [], function($locationProvider){$locationProvider.html5Mode(true);});
  var client = new PeerManager();
  /* camera configuration */
  // basic setting
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

  app.controller('RemoteStreamsController', ['$location', '$http', '$window', '$scope', function($location, $http, $window, $scope){
    var ctrl = this;
    ctrl.remoteStreams = [];
    function getStreamById(id) {
        for(var i=0; i<ctrl.remoteStreams.length;i++) {
          if (ctrl.remoteStreams[i].id === id) {return ctrl.remoteStreams[i];}
        }
    }
    ctrl.loadData = function () {
      // get list of streams from the server
      $http.get('/streams').success(function(data){
        // filter own stream
        var streams = data.filter(function(stream) {
              return stream.id !== client.getId();
          });
          // get former state
          for(var i = 0; i < streams.length; i++) {
            var stream = getStreamById(streams[i].id);
            streams[i].isPlaying = (!!stream) ? stream.isPlaying : false;
          }
          // save new streams
          ctrl.remoteStreams = streams;
          // console.log('RemoteStreamsController: update stream list...');
      });
    };
    client.add_external_mechanism('load_data', ctrl.loadData);

    // view remote stream
    ctrl.view = function(stream){
      client.peerInit(stream.id);
      stream.isPlaying = !stream.isPlaying;
    };

    //
    ctrl.start_recording = function(stream){
      //
    }

    ctrl.stop_recording = function(stream){
      //
    }

    // initially load streams
    ctrl.loadData();
  }]);

})(jQuery);