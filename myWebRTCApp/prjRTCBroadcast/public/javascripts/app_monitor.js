(function($){
  'use strict';
  var app = angular.module('myWebRTC', [], function($locationProvider){$locationProvider.html5Mode(true);});
  var client = new PeerManager();
  /* camera configuration */
  // basic setting
  var mediaConfig = {
        audio: true,
        video: { mandatory: {
            minWidth: 1280,
            minHeight: 720,
            maxWidth: 1280,
            maxHeight: 720,
            frameRate: { min: 35, ideal: 50, max: 60 }
          }
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
      var remote_peer = client.peerInit(stream.id);
      remote_peer.start_recording_btn.addEventListener('click', function(){
        //
        alert('start recording');
      });
      remote_peer.stop_recording_btn.addEventListener('click', function(){
        //
        alert('stop recording');
      });
      stream.isPlaying = !stream.isPlaying;
    };

    // check if recording status
    ctrl.is_remote_stream_on = function(stream){
      //
    }

    //
    ctrl.start_recording = function(stream){
      //
      alert('start recording');
      ctrl.is_recording_start_recording_btn_disable = true;
      ctrl.is_recording_stop_recording_btn_disable = false;
    }

    ctrl.stop_recording = function(stream){
      //
      alert('stop recording');
      ctrl.is_recording_start_recording_btn_disable = true;
      ctrl.is_recording_stop_recording_btn_disable = false;
    }

    ctrl.is_recording = function(stream){
      //
    }

    // initially load streams
    ctrl.loadData();
  }]);

})(jQuery);