var WebRTCClient;

try {
  WebRTCClient = initWebRTCClient();
}
catch(e) {
  console.log(e);
  console.log("Cannot run WebRTCClient tests");
}

if(WebRTCClient) {
  describe("WebRTCClient", function() {
    it("should be able to make client1 send \"Hello World!\" to client2", function(done) {
      var client1 = WebRTCClient();
      var client2 = WebRTCClient();

      var p_offer = WebRTCClient.createOffer(client1);
      var p_answer = p_offer.chain(function(offer) {
        return WebRTCClient.receiveOffer(client2, offer);
      });

      var p_ready = p_answer.chain(function(answer) {
        WebRTCClient.receiveAnswer(client1, answer);

        return client1.channel.conjoin(client2.channel);
      });

      p_ready.spread(function(channel1, channel2) {
        channel2.onmessage = function(message) {
          expect(message.data).toBe("Hello World!");
          done();
        };
        channel1.send("Hello World!");
      });
    });
  });
}
