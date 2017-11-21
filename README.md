# Undeep

> Micro-library exposing deeply-nested members

## Purpose

Attempting to access deeply nested values whose ancestors may not exist can cause undesirable errors.  In many cases, it would be enough to know that the value is not defined.  Undeep swallows these errors, returning the desired value or ```undefined```.

Sometimes along the way we want to compute a key, e.g., the last index in an array, before continuing.  Passing a key function allows us to do this.  Key functions should be safe and side-effect-free; see [caveats](#cavets).

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

Starting object to be searched.  Passing a non-object will search the implicit object wrapper.

#### key1, key2, ...

Keys to search for in order.  Each returned value is searched for the following key. The function will return when keys are exhausted.  If no keys are passed, the ```target``` is returned.

Keys may be computed from the preceeding value by passing a function instead of a primitive.

## Caveats

Because it intentionally swallows errors, undeep should be used only for retrieving data which may not be defined.  Any functions passed should be side-effect-free.  Be aware that simply accessing some members can have side-effects, if they involve getter functions.

Each key should be a primitive value or function.  Most objects passed as keys will be interpreted as ```"[object Object]"``` and as such will return the same member (if it is defined).

## Underp

Instead of ```undefined```, ```underp()``` logs (without throwing) any error it catches along the way.  Underp should only be used for debugging.

## License

ISC © [N.D.Christie](https://github.com/ndchristie)
