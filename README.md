# Undeep

> Micro-library exposing deeply-nested members

## Purpose

Attempting to access deeply nested values whose ancestors may not exist can cause undesirable errors.  In many cases, it would be enough to know that the value is undefined.  Undeep swallows these errors, returning the desired value or undefined.

Sometimes along the way we want to compute a key, e.g., the last index in an array, before continuing.

## Install

``` bash
$ npm install --save undeep
```


## Usage

``` js
const undeep = require('undeep');

const target = {
  first: {
    second: [
      { bool: true },
    ],
  },
};

undeep(target);
// target
undeep(target, 'first');
// target.first
undeep(target, 'first', 'second', 0, 'bool', 'constructor', 'name');
// 'Boolean'
undeep(target, 'undef', 'cannot get properties of undefined');
// undefined
undeep(null, 'cannot get properties of null');
// undefined
undeep([0, 1, 2, 3, 4, 5], arr => arr.length >> 1);
// 3
```


## API

### undeep(target[, key1[, key2[, ...]]])

Returns deep members of a target object or undefined.

#### target

Starting object to be searched.  Passing a non-object will search the implicit object wrapper.  Passing null will return undefined.

#### key1, key2, ...

Keys to search for in order.  Each returned value is searched for the following key. The function will return when keys are exhausted.  If no keys are passed, the target object is returned.

Keys may be computed from the preceeding value by passing a function instead of a primitive.

## License

ISC © [N.D.Christie](https://github.com/ndchristie)
