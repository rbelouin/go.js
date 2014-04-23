module.exports = function(grunt) {
  grunt.initConfig({
    bower_concat: {
      all: {
        dest: "dependencies.js"
      }
    },
    concat: {
      all: {
        src: ["dependencies.js", "src/board.js"],
        dest: "go.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-bower-concat");
  grunt.loadNpmTasks("grunt-contrib-concat");

  grunt.registerTask("default", ["bower_concat", "concat"]);
};
