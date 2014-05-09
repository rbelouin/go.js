var WSClient = initWSClient();

describe("WSClient", function() {
  it("should be able to make client send \"Hello World!\" to server", function(done) {
    var client = WSClient({
      host: "http://127.0.0.1:8080"
    });

    client.stream.onValue(function(message) {
      expect(message).toBe("Hello World!");
      done();
    });

    WSClient.connect(client);
    WSClient.send(client, "Hello World!");
  });
});
