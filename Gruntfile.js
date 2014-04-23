module.exports = function(grunt) {
  grunt.initConfig({
    bower_concat: {
      all: {
        dest: "dependencies.js"
      }
    }
  });

  grunt.loadNpmTasks("grunt-bower-concat");

  grunt.registerTask("default", ["bower_concat"]);
};
