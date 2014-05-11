module.exports = function(grunt) {
  var files = ["src/models/board.js", "src/models/game.js", "src/models/webrtc-client.js", "src/models/ws-client.js", "src/models/client.js", "src/views/board.js", "src/views/pass.js", "src/controllers/game.js"];

  grunt.initConfig({
    bower_concat: {
      all: {
        dest: "dependencies.js",
        mainFiles: {
          "socket.io-client": "dist/socket.io.js"
        }
      }
    },
    concat: {
      all: {
        src: ["dependencies.js"].concat(files),
        dest: "go.js"
      }
    },
    jasmine: {
      src: "go.js",
      options: {
        host: "http://127.0.0.1:8080/",
        outfile: "tests.html",
        specs: "tests/**/*.spec.js"
      }
    },
    watch: {
      all: {
        files: files,
        tasks: ["concat", "jasmine"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-bower-concat");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("start-test-server", function() {
    var server = require("./tests/server.js");
    server.start();
  });

  grunt.registerTask("build", ["bower_concat", "concat"]);
  grunt.registerTask("test", ["start-test-server", "jasmine"]);

  grunt.registerTask("default", ["build", "test"]);
};
