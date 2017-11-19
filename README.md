# Undeep

> Micro-library exposing deeply-nested members

## Purpose

Attempting to access deeply nested values whose ancestors may not exist can cause undesirable errors.  In many cases, it would be enough to know that the value is undefined.  Undeep swallows these errors, returning the desired value or undefined.

## Install

``` bash
$ npm install --save lpad
```


## Usage

```js
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
```


## API

### undeep(target, [...keys])

Returns deep members of a target object or undefined.

#### target

Starting object to be searched.  Passing a non-object will search the implicit object wrapper.  Passing null will return undefined.

#### keys

Keys to search for in order.  Each returned value is searched for the following key. The function will return when keys are exhausted.  If no keys are passed, the target object is returned.

## License

ISC © [N.D.Christie](https://github.com/ndchristie)
