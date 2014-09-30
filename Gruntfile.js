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
            'src/core/linq/empty.js',
            'src/core/linq/from.js',
            'src/core/linq/of.js',
            'src/core/linq/range.js',
            'src/core/linq/repeat.js',

            // Aggregate operators
            'src/core/linq/average.js',
            'src/core/linq/contains.js',
            'src/core/linq/count.js',
            'src/core/linq/elementat.js',
            'src/core/linq/elementatordefault.js',
            'src/core/linq/every.js',
            'src/core/linq/find.js',
            'src/core/linq/findindex.js',
            'src/core/linq/first.js',
            'src/core/linq/firstordefault.js',
            'src/core/linq/foreach.js',
            'src/core/linq/indexof.js',
            'src/core/linq/reduce.js',
            'src/core/linq/some.js',
            'src/core/linq/sum.js',

            // Standard query operators
            'src/core/linq/defaultifempty.js',
            'src/core/linq/distinct.js',
            'src/core/linq/except.js',
            'src/core/linq/flatmap.js',
            'src/core/linq/map.js',
            'src/core/linq/filter.js',

            // Single operators


            'src/core/exports.js',
            'src/core/outro.js'
          ],
          dest: 'dist/ix.js'
        }
      },
      uglify: {
        options: {
          banner:
            '/* Copyright (c) Microsoft Open Technologies, Inc. All rights reserved. See License.txt in the project root for license information.*/'
        },
        basic: {
          options: {
            sourceMap: true,
            sourceMapName: 'dist/ix.map'
          },
          files: {'dist/ix.min.js': ['dist/ix.js'] }
        },
      },
      qunit: {
        all: ['tests/*.html']
      }
  });

  // Load all "grunt-*" tasks
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['concat:basic', 'uglify:basic', 'qunit']);
};