# The Reactive Extensions for JavaScript... #
*...is a set of libraries to compose pull-based collections and LINQ-style query operators in JavaScript*

This project has moved to [CodePlex](http://rx.codeplex.com/) and only serves as a mirror.

## About the Interactive Extensions Extensions ##

This set of libraries include:

- **l2o.js** - Core LINQ to Objects library
- **ix.js** - Interactive Extensions for JavaScript

## Getting Started ##

Coming Soon

##  API Documentation ##

Coming Soon

## Installation and Usage ##

There are multiple ways of getting started with the Interactive Extensions including:

In a Browser:

    <script src="l2o.js"></script>
    <script src="ix.js"></script>

Installing via NPM:

    npm install ix
    npm install -g ix

Using in Node.js:

    var Ix = require('ix');

Using RxJS with an AMD loader such as Require.js

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