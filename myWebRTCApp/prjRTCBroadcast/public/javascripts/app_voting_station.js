/* voting station
* angular.js app
*/
(function($){
  'use strict';
  var app = angular.module('myWebRTC', [], function($locationProvider){$locationProvider.html5Mode(true);});
  var client = new PeerManager();
  /* camera setting */
  // basic
  // var mediaConfig = {
  //       audio: true,
  //       video: true
  //   };
  // HD
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
  var my_local_stream; // for recording

  app.factory('camera', ['$rootScope', '$window', function($rootScope, $window){
    var camera = {};
    /*
    * var cameraPreview = document.getElementById('camera-preview');
    * navigator.getUserMedia({audio: true, video: true}, function(stream){ ... });
    */
    camera.preview = $window.document.getElementById('localVideo');
    camera.isOn = false;
    camera.start = function(){
      return requestUserMedia(mediaConfig)
      .then(function(stream){
        // onSuccess; this function will be assigned to resolve() in adapter.js
        my_local_stream = stream;
        console.log(my_local_stream);
        attachMediaStream(camera.preview, stream);
        client.setLocalStream(stream);
        camera.stream = stream;
        camera.isOn = true;
        $rootScope.$broadcast('cameraIsOn',true);
        console.log('OnSuccess...');
      }, function(arg_error){
        // onError; this function will be assigned to reject() in adapter.js
        console.log('OnError...');
      })
      .catch(Error('Failed to get access to local media.'));
    };
    camera.stop = function(){
      return new Promise(function(resolve, reject){     
      try {
        camera.stream.stop();
        camera.preview.src = '';
        resolve();
      } catch(error) {
        reject(error);
      }
      })
      .then(function(result){
        camera.isOn = false;
        $rootScope.$broadcast('cameraIsOn',false);
      }); 
    };
    return camera;
  }]);

  app.controller('IndexController', ['$window', '$location', function($window, $location){
    //
    var ctrl = this;
  }]);

  app.controller('RemoteStreamsController', ['camera', '$location', '$http', '$window', function(camera, $location, $http, $window){
    var rtc = this;
    rtc.remoteStreams = [];
    function getStreamById(id) {
        for(var i=0; i<rtc.remoteStreams.length;i++) {
          if (rtc.remoteStreams[i].id === id) {return rtc.remoteStreams[i];}
        }
    };
    rtc.loadData = function () {
      // get list of streams from the server
      $http.get('/streams').success(function(data){
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

    //
    rtc.view = function(stream){
      client.peerInit(stream.id);
      stream.isPlaying = !stream.isPlaying;
    };
    rtc.call = function(stream){
      /* If json isn't loaded yet, construct a new stream 
       * This happens when you load <serverUrl>/<socketId> : 
       * it calls socketId immediatly.
      **/
      if(!stream.id){
        stream = {id: stream, isPlaying: false};
        rtc.remoteStreams.push(stream);
      }
      if(camera.isOn){
        client.toggleLocalStream(stream.id);
        if(stream.isPlaying){
          // client.peerRenegociate(stream.id);
        } else {
          // client.peerInit(stream.id);
        }
        client.peerInit(stream.id);
        stream.isPlaying = !stream.isPlaying;
      } else {
        camera.start()
        .then(function(result) {
          client.toggleLocalStream(stream.id);
          if(stream.isPlaying){
            // client.peerRenegociate(stream.id);
          } else {
            // client.peerInit(stream.id);
          }
          client.peerInit(stream.id);
          stream.isPlaying = !stream.isPlaying;
        })
        .catch(function(err) {
          console.log(err);
        });
      }
    };

    //initial load
    rtc.loadData();
  }]);

  app.controller('LocalStreamController',['camera', '$scope', '$window', function(camera, $scope, $window){
    var localStream = this;
    localStream.name = 'Station';
    localStream.link = '';
    localStream.cameraIsOn = false;
    localStream.isFirefox = !!navigator.mozGetUserMedia;

    $scope.$on('cameraIsOn', function(event,data) {
        $scope.$apply(function() {
          localStream.cameraIsOn = data;
        });
    });

    // init; set user_type
    localStream.init = function(arg_user_type){
      localStream.user_type = arg_user_type;
    };

    // recording setting
    localStream.is_start_recording_btn_disabled = false;
    localStream.is_stop_recording_btn_disabled = true;

    // toggle camera
    localStream.toggleCam = function(){
      // check if username empty
      if(localStream.name.trim() === ''){
        alert('Station name is empty; please provide a station name');
        return false;
      }

      if(localStream.cameraIsOn){
        camera
        .stop()
        .then(function(result){
          // stop recording
          if(localStream.is_start_recording_btn_disabled){
            //
            localStream.stop_recording();
          }
          // send message to server
          client.send('leave');
          client.setLocalStream(null);
        })
        .catch(function(err) {
          console.log(err);
        });
      } else {
        // for regular user, no need to start camera
        console.log('start camera...');
        camera
        .start()
        .then(function(result) {
          localStream.link = $window.location.host + '/' + client.getId();
          client.send('readyToStream', { name: localStream.name, user_type: localStream.user_type });
        })
        .catch(function(err) {
          console.log(err);
        });
      }
    };

    // start recording
    localStream.start_recording = function(){
      if(my_local_stream){
        // start recording
        localStream.start_timestamp = new Date().getTime();
        localStream.record_rtc = RecordRTC(my_local_stream, {
                                  bufferSize: 16384,
                                  type: 'video',
                                  frameInterval: 20
                                });
        localStream.record_rtc.startRecording();

        localStream.is_start_recording_btn_disabled = true;
        localStream.is_stop_recording_btn_disabled = false;
      }
    };

    // stop recording
    localStream.stop_recording = function(){
      localStream.record_rtc.stopRecording(function() {
        localStream.is_start_recording_btn_disabled = false;
        localStream.is_stop_recording_btn_disabled = true;

        // stop recording
        localStream.stop_timestamp = new Date().getTime();
        var file_name = localStream.name + '-' + localStream.start_timestamp + '_' + localStream.stop_timestamp;
        localStream.record_rtc.stopRecording(function(){
          console.log('stop recording...');
        });
        localStream.record_rtc.save(file_name);
      });
    };
  }]);
})(jQuery);