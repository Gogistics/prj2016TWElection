var PeerManager = (function () {
  // init socket manager
  var local_id,
      config = {
        peerConnectionConfig: {
          iceServers: [
            {urls: 'stun:stun1.l.google.com:19302'},
            {urls: 'stun:stun2.l.google.com:19302'},
            {urls: 'stun:stun3.l.google.com:19302'},
            {urls: 'stun:stun4.l.google.com:19302'},
            {urls: 'stun:stun.anyfirewall.com:3478'},
            {urls: "stun:stun.l.google.com:19302"},
            {urls: 'turn:turn.bistri.com:80',
              credential: 'homeo',
              username: 'homeo'},
            {urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
              credential: 'webrtc',
              username: 'webrtc'},
            {urls: 'stun:stun.services.mozilla.com'}
          ]
        },
        peerConnectionConstraints: {
          optional: [
            {"DtlsSrtpKeyAgreement": true}
          ]
        }
      },
      peerDatabase = {}, // can be replaced with real DB
      localStream,
      remoteVideoContainer = document.getElementById('remoteVideosContainer'),
      socket = io(), // better to be set to listen to specific IP & port
      external_mechanism = {};
      
  // set socket
  socket.on('message', handleMessage);
  socket.on('id', function(id) {
    local_id = id;
  });

  // auto-update mechanism (beta)
  socket.on('new_stream_notification', function(res){
    console.log(res);
    if(external_mechanism.hasOwnProperty('load_data')){
      // load data
      external_mechanism.load_data();
      console.log('update stream list...');
    }
  });
  // end of auto-update mechanism

  // funstions
  function addPeer(remoteId) {
    var peer = new Peer(config.peerConnectionConfig, config.peerConnectionConstraints);
    peer.pc.onicecandidate = function(event) {
      if (event.candidate) {
        send('candidate', remoteId, {
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        });
      }
    };
    peer.pc.onaddstream = function(event) {
      attachMediaStream(peer.remoteVideoEl, event.stream);
      remoteVideosContainer.appendChild(peer.remoteVideoEl);
    };
    peer.pc.onremovestream = function(event) {
      peer.remoteVideoEl.src = '';
      if(remoteVideosContainer.hasChildNodes()){
        remoteVideosContainer.removeChild(peer.remoteVideoEl);
      }
      // remoteVideosContainer.removeChild(peer.remoteVideoEl);
    };
    peer.pc.oniceconnectionstatechange = function(event) {
      switch(
      (  event.srcElement // Chrome
      || event.target   ) // Firefox
      .iceConnectionState) {
        case 'disconnected':
          remoteVideosContainer.removeChild(peer.remoteVideoEl);
          break;
      }
    };
    // removeStream() to support Firefox
    peer.pc.removeStream = function(stream) {
      peer.pc.getSenders().forEach(function(sender){
        console.log(sender);
        // incomplete; this mechanism will be triggered twice to remove video & audio tracks
        peer.pc.removeTrack(sender);
        if(remoteVideosContainer.hasChildNodes()){
          remoteVideosContainer.removeChild(peer.remoteVideoEl);
        }
      });
    };
    // end removeStream

    peerDatabase[remoteId] = peer;
    return peer;
  }
  // end of addPeer

  // answer
  function answer(remoteId) {
    var pc = peerDatabase[remoteId].pc;
    pc.createAnswer(
      function(sessionDescription) {
        pc.setLocalDescription(sessionDescription);
        send('answer', remoteId, sessionDescription);
      }, 
      error
    );
  }
  // end of answer

  // offer
  function offer(remoteId) {
    var pc = peerDatabase[remoteId].pc;
    pc.createOffer(
      function(sessionDescription) {
        pc.setLocalDescription(sessionDescription);
        send('offer', remoteId, sessionDescription);
      }, 
      error
    );
  }
  // end of offer

  // handleMessage
  function handleMessage(message) {
    var type = message.type,
        from = message.from,
        pc = (peerDatabase[from] || addPeer(from)).pc;

    console.log('received ' + type + ' from ' + from);
    switch (type) {
      case 'init':
        toggleLocalStream(pc);
        offer(from);
        break;
      case 'offer':
        pc.setRemoteDescription(new RTCSessionDescription(message.payload), function(){}, error);
        answer(from);
        break;
      case 'answer':
        pc.setRemoteDescription(new RTCSessionDescription(message.payload), function(){}, error);
        break;
      case 'candidate':
        if(pc.remoteDescription) {
          pc.addIceCandidate(new RTCIceCandidate({
            sdpMLineIndex: message.payload.label,
            sdpMid: message.payload.id,
            candidate: message.payload.candidate
          }), function(){}, error);
        }
        break;
    }
  }
  // end of handleMessage

  // send
  function send(type, to, payload) {
    console.log('sending ' + type + ' to ' + to);
    socket.emit('message', {
      to: to,
      type: type,
      payload: payload
    });
  }
  // end of send

  // toogleLocalStream
  function toggleLocalStream(pc) {
    if(localStream) {
      (!!pc.getLocalStreams().length) ? pc.removeStream(localStream) : pc.addStream(localStream);
    }
  }
  // end of toogleLocalStream

  // error logger
  function error(err){
    console.log(err);
  }
  // end of error

  return {
    getId: function() {
      return local_id;
    },
    setLocalStream: function(stream) {
      // if local cam has been stopped, remove it from all outgoing streams.
      if(!stream) {
        for(id in peerDatabase) {
          pc = peerDatabase[id].pc;
          if(!!pc.getLocalStreams().length) {
            pc.removeStream(localStream);
            offer(id);
          }
        }
      }

      localStream = stream;
    }, 
    toggleLocalStream: function(remoteId) {
      peer = peerDatabase[remoteId] || addPeer(remoteId);
      toggleLocalStream(peer.pc);
    },
    peerInit: function(remoteId) {
      peer = peerDatabase[remoteId] || addPeer(remoteId);
      send('init', remoteId, null);
    },
    peerRenegociate: function(remoteId) {
      offer(remoteId);
    },
    send: function(type, payload) {
      socket.emit(type, payload);
    },

    // load_data mechanism (temp)
    add_external_mechanism: function(arg_mechanism_name, arg_mechanism){
      // set external mechanism
      external_mechanism[arg_mechanism_name] = arg_mechanism;
    }
  };
});

/* Peer */
var Peer = function (pcConfig, pcConstraints){
  this.pc = new RTCPeerConnection(pcConfig, pcConstraints);
  this.remoteVideoEl = document.createElement('video');
  this.remoteVideoEl.controls = true;
  this.remoteVideoEl.autoplay = true;
  this.remoteVideoEl.muted = true; // tmp init
  console.log('muted video...');
}
