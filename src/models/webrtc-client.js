var initWebRTCClient = function() {
  var Connection, Description;

  if(typeof mozRTCPeerConnection != "undefined") {
    Connection = mozRTCPeerConnection;
  }
  else if(typeof webkitRTCPeerConnection != "undefined") {
    Connection = webkitRTCPeerConnection;
  }
  else {
    throw new Error("Please install a browser that provides a RTCPeerConnection support");
  }

  if(typeof mozRTCSessionDescription != "undefined") {
    Description = mozRTCSessionDescription;
  }
  else if(typeof RTCSessionDescription != "undefined") {
    Description = RTCSessionDescription;
  }
  else {
    throw new Error("Please install a browser that provides a RTCSessionDescription support");
  }

  var WebRTCClient = function() {
    return {
      connection: new Connection({
        iceServers: []
      }),
      channel: new Promise()
    };
  };

  WebRTCClient.createOffer = function(client) {
    var result = new Promise();

    var channel = client.connection.createDataChannel("channel", {});

    channel.onopen = function() {
      console.log("channel open");
    };
    channel.onclose = function() {
      console.log("channel close");
    };
    channel.onerror = function() {
      console.log("channel error");
    };

    client.channel.resolve(channel);

    function onoffer(offer) {
      client.connection.setLocalDescription(offer);
      result.resolve(offer);
    }

    function onerror(error) {
      result.reject(error);
    }

    client.connection.createOffer(onoffer, onerror);

    return result;
  };

  WebRTCClient.receiveOffer = function(client, offer) {
    var result = new Promise();

    client.connection.setRemoteDescription(new Description(offer));

    function onanswer(answer) {
      client.connection.setLocalDescription(answer);
      result.resolve(answer);
    }

    function onerror(error) {
      result.reject(error);
    }

    client.connection.createAnswer(onanswer, onerror);

    client.connection.ondatachannel = function(event) {
      var channel = event.channel;

      channel.onopen = function() {
        console.log("channel open");
      };
      channel.onclose = function() {
        console.log("channel close");
      };
      channel.onerror = function() {
        console.log("channel error");
      };

      client.channel.resolve(channel);
    };

    return result;
  };

  WebRTCClient.receiveAnswer = function(client, answer) {
    client.connection.setRemoteDescription(new Description(answer));
  };

  return WebRTCClient;
};
