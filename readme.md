[![Build Status](https://travis-ci.org/Reactive-Extensions/IxJS.png)](https://travis-ci.org/Reactive-Extensions/IxJS)

# The Interactive Extensions for JavaScript... #
*...is a set of libraries to compose pull-based collections and LINQ-style query operators in JavaScript*

The Interactive Extensions for JavaScript (IxJS) is an implementation of Language Integrated Query (LINQ) to Objects in native JavaScript with a core set of operators on par with the [.NET implementation](http://msdn.microsoft.com/en-us/library/vstudio/bb397926.aspx).  This implementation uses the same techniques for lazy evaluation of chained functions, for example map/select and filter/where.  This allows you as the user to write rich expressive queries against a number of data sources without taking a performance hit.  

We provide two files, a core implementation of LINQ to Objects in l2o.js and the Interactive Extensions in ix.js.  The Interactive Extensions is a set of functions that were found to be useful for the Reactive Extensions (Rx) and were ported from the push model of Rx to a pull model.

Getting started is easy.  For example, we could generate data, filter it and then display the results:

	// Generate the data
	var data = Ix.Enumerable.range(0, 10);

	// Query the data
	var query = data
		.map( function (x) {
			return x * x;
		})
		.filter( function (x) {
			return x % 3 === 0;
		});

	// Now execute the query
	query.forEach( function (x, idx) {
		console.log(x, idx);
	});

Note the execution of the query doesn't take place until forEach is called.

This project is a mirror of the [CodePlex](http://rx.codeplex.com/) repository.

## About the Interactive Extensions Extensions ##

This set of libraries include:

- **l2o.js** - Core LINQ to Objects library
- **ix.js** - Interactive Extensions for JavaScript

##  API Documentation ##

You can find the documentation [here](https://github.com/Reactive-Extensions/IxJS/tree/master/doc) as well as examples [here](https://github.com/Reactive-Extensions/IxJS/tree/master/examples).

## Installation and Usage ##

There are multiple ways of getting started with the Interactive Extensions.  The files are available on [cdnjs](http://cdnjs.com/) and [jsDelivr](http://www.jsdelivr.com/#!ixjs).

### In a Browser:

    <script src="l2o.js"></script>
    <script src="ix.js"></script>

### Installing with [Bower](http://bower.io/)

	bower install ix

### Installing with [Jam](http://jamjs.org/)
	
	jam install ix

### Installing via [NPM](https://npmjs.org/):

    npm install ix
    npm install -g ix

### Using in Node.js:

    var Ix = require('ix');

    var source = Ix.Enumerable.fromArray([1,2,3]);

    source.forEach(function (x) {
    	console.log('Next: ' + x);	
	});

	// => 1, 2, 3

### Using RxJS with an AMD loader such as Require.js

    require({
        'paths': {
            'ix': 'path/to/ix.js'
        }
    },
    ['ix'], function(Ix) {
        var obs = Ix.Enumerable.returnValue(42);
        obs.subscribe(function (x) { console.log(x); });
    });

## Compatibility ##

IxJS has been thoroughly tested against all major browsers and supports IE6+, Chrome 4+, FireFox 1+, and Node.js v0.4+. 

## License ##

Copyright (c) Microsoft Open Technologies, Inc.  All rights reserved.
Microsoft Open Technologies would like to thank its contributors, a list
of whom are at http://rx.codeplex.com/wikipage?title=Contributors.

Licensed under the Apache License, Version 2.0 (the "License"); you
may not use this file except in compliance with the License. You may
obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions
and limitations under the License.