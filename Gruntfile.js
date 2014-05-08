module.exports = function(grunt) {
  var files = ["src/models/board.js", "src/models/game.js", "src/models/webrtc-client.js", "src/views/board.js", "src/controllers/game.js"];

  grunt.initConfig({
    bower_concat: {
      all: {
        dest: "dependencies.js"
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

  grunt.registerTask("default", ["bower_concat", "concat", "jasmine"]);
};
