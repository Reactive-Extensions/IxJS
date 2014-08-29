module.exports = function (grunt) {

  grunt.initConfig({
      meta: {
        banner:
          '/*'+
          'Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.\r\n' +
          'Microsoft Open Technologies would like to thank its contributors.\r\n' +
          'Licensed under the Apache License, Version 2.0 (the "License"); you.\r\n' +
          'may not use this file except in compliance with the License. You may.\r\n' +
          'obtain a copy of the License at.\r\n\r\n' +
          'http://www.apache.org/licenses/LICENSE-2.0.\r\n\r\n' +
          'Unless required by applicable law or agreed to in writing, software.\r\n' +
          'distributed under the License is distributed on an "AS IS" BASIS,.\r\n' +
          'WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or.\r\n' +
          'implied. See the License for the specific language governing permissions.\r\n' +
          'and limitations under the License..\r\n' +
          '*/'
      },
      concat: {
        basic: {
          src: [
            'src/core/license.js',
            'src/core/intro.js',
            'src/core/basicheader.js',
            'src/core/internal/isequal.js',
            'src/core/enumerator.js',
            'src/core/enumerable.js',

            // Creation operators
            'src/core/linq/of.js',
            'src/core/linq/range.js',
            'src/core/linq/repeat.js',

            // Aggregate operators
            'src/core/linq/count.js',
            'src/core/linq/find.js',
            'src/core/linq/findindex.js',
            'src/core/linq/foreach.js',
            'src/core/linq/reduce.js',
            'src/core/linq/sum.js',

            // Standard query operators
            'src/core/linq/flatmap.js',
            'src/core/linq/map.js',
            'src/core/linq/filter.js',

            'src/core/exports.js',
            'src/core/outro.js'
          ],
          dest: 'dist/ix.js'
        }
      },
      uglify: {
        basic: {
          src: ['<banner>', 'dist/ix.js'],
          dest: 'dist/ix.min.js'
        },
      },
      qunit: {
        all: ['tests/*.html']
      }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['concat:basic', 'uglify:basic']);
};