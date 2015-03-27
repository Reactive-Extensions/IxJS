# Ix.js <sup>v1.0.5</sup>

# Enumerable object #

The Enumerable object represents a pull based collection.  This class exposes the enumerator, which supports a simple iteration over a collection.  This object also provides a set of methods for querying objects that inherit from the Enumerable class.

## <a id="Enumerable1"></a>`Enumerable Methods`
- [case](#switchCase)
- [catch](#catchException1)
- [concat](#concat1)
- [defer](#defer)
- [doWhile](#doWhile)
- [for](#forIn)
- [fromArray](#fromArray)
- [generate](#generate)
- [if](#ifThen)
- [onErrorResumeNext](#onErrorResumeNext1)
- [range](#range)
- [repeat](#repeat1)
- [return](#returnValue)
- [start](#start)
- [using](#using)
- [while](#whileDo)

<!-- div -->

<!-- div -->

## <a id="Enumerable2"></a>`Enumerable Instance Methods`
- [aggregate](#aggregate)
- [all](#all)
- [any](#any)
- [average](#average)
- [bufferWithCount](#bufferWithCount)
- [catch](#catchException2)
- [concat](#concat2)
- [contains](#contains)
- [count](#count)
- [defaultIfEmpty](#defaultIfEmpty)
- [distinct](#distinct)
- [distinctBy](#distinctBy)
- [distinctUntilChanged](#distinctUntilChanged)
- [do](#doAction)
- [elementAt](#elementAt)
- [elementAtOrDefault](#elementAtOrDefault)
- [empty](#empty)
- [finally](#finallyAction)
- [first](#first)
- [firstOrDefault](#firstOrDefault)
- [groupBy](#groupBy)
- [groupJoin](#groupJoin)
- [ignoreElements](#ignoreElements)
- [isEmpty](#isEmpty)
- [join](#join)
- [last](#first)
- [lastOrDefault](#lastOrDefault)
- [max](#max)
- [maxBy](#maxBy)
- [min](#min)
- [minBy](#minBy)
- [onErrorResumeNext](#onErrorResumeNext2)
- [repeat](#repeat2)
- [replay](#replay)
- [retry](#retry)
- [sample](#sample)
- [scan](#scan)
- [select](#select)
- [selectMany](#selectMany)
- [single](#single)
- [singleOrDefault](#singleOrDefault)
- [skip](#single)
- [skipLast](#singleOrDefault)
- [skipWhile](#skipWhile)
- [sum](#sum)
- [switchLatest](#switchLatest)
- [take](#take)
- [takeLast](#takeLast)
- [takeWhile](#takeWhile)
- [throwException](#throwException)
- [toArray](#toArray)
- [where](#where)
- [zip](#zip)


### <a id="switchCase"></a>`Ix.Enumerable.case`
<a href="#switchCase">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/IxJS/blob/master/ix.js#L1224-L1233 "View in source") [&#x24C9;][1]

Returns a sequence from a dictionary based on the result of evaluating a selector function, also specifying a default sequence.
An alias for this method is switchCase for browsers <IE9.

#### Arguments
1. `selector` *(Function)*: Selector function used to pick a sequence from the given sources.
2. `sources` *(Object)*: Dictionary mapping selector values onto resulting sequences.
3. [`defaultSource`] *(Enumerable*): Default sequence to return in case there's no corresponding source for the computed selector value; if not provided defaults to empty Enumerable.

#### Returns
*(Enumerable)*: The source sequence corresponding with the evaluated selector value; otherwise, the default source.

#### Example
```js
var source = Ix.Enumerable.case(
	Ix.Enumerable.return(42), {
		42: 'foo',
		24: 'bar'
	}, 
	Ix.Enumerable.return(56));

console.log(source.first());

// => 'foo'
```

* * *

### <a id="catchException"></a>`Ix.Enumerable.catch`
<a href="#catchException">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/IxJS/blob/master/ix.js#L998-L1055 "View in source") [&#x24C9;][1]

Creates a sequence by concatenating source sequences until a source sequence completes successfully.  An alias for this method is catchException for browsers <IE9.

#### Arguments
1. `array` *(arguments)*: An arguments array containing Enumerable sequences.  

#### Returns
*(Enumerable)*: Sequence that continues to concatenate source sequences while errors occur.

#### Example
```js
var source = Ix.Enumerable.catch(
	Ix.Enumerable.throw(new Error('first')),
	Ix.Enumerable.throw(new Error('second')),
	Ix.Enumerable.return(42)
);

console.log(source.first());

// => 42
```

* * *

### <a id="concat1"></a>`Ix.Enumerable.concat`
<a href="#concat1">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/IxJS/blob/master/l2o.js#L2009-L2011 "View in source") [&#x24C9;][1]

Concatenates all given sequences as arguments.

#### Arguments
1. `array` *(arguments)*: An arguments array containing Enumerable sequences.  

#### Returns
*(Enumerable)*: An Enumerable that contains the concatenated elements of the input sequences.

#### Example
```js
var source = Ix.Enumerable.concat(
	Ix.Enumerable.return(42),
	Ix.Enumerable.return(56)
);

source.forEach(function (item) {
	console.log(item);
});

// => 42
// => 56
```

* * *

### <a id="fromArray"></a> `Ix.Enumerable.fromArray`
<a href="#fromArray">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/IxJS/blob/master/l2o.js#L2037-L2059 "View in source") [&#x24C9;][1]

Converts an Array to an Enumerable sequence.

#### Arguments
1. `array`: An array to convert to an Enumerable sequence.

#### Returns
*(Enumerable)*: An Enumerable sequence created by the values in the array.

#### Example
```js
var source = Ix.Enumerable.fromArray([42,56]);

source.forEach(function (item) {
	console.log(item);
});

// => 42
// => 56
```

* * *

### <a id="scan"></a> `Ix.Enumerable.scan`
<a href="#scan">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/IxJS/blob/master/ix.js#L803-L861 "View in source") [&#x24C9;][1]

Generates a sequence of accumulated values by scanning the source sequence and applying an accumulator function.

#### Arguments
1. `seed`: Accumulator seed value.
2. `accumulator`: Accumulation function to apply to the current accumulation value and each element of the sequence.
#### Returns
*(Enumerable)*: Sequence with all intermediate accumulation values resulting from scanning the sequence.

#### Example
```js
var source = Ix.Enumerable.fromArray([0,1,2,3,4])
	.scan(0, function(accumulation, currentValue){ 
		return accumulation+currentValue;
	})

source.forEach(function (item) {
	console.log(item);
});

// => 0
// => 1
// => 3
// => 6
// => 10
```

* * *