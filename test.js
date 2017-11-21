/* eslint-env node */
/* eslint-disable no-console */

var assert = require('assert');
var sinon = require('sinon');
var undeep = require('./');
var underp = require('./underp');

describe('undeep', function () {
  var testTarget = {
    childObj: {
      bool: true,
      arr: [1, 0, { x: 5, y: 2 }],
      empty: null,
      Array: Array,
      anon: function () { /* do nothing */ },
    },
  };
  testTarget.circular = testTarget;
  Object.defineProperties(testTarget, {
    computed: {
      get: function () { return 7; }
    },
    sabotaged: {
      get: function () { throw new Error('Listen all y\'all it\'s a sabotage'); },
    },
  });
  // basic cases
  it('Returns the target object in the absence of additonal args', function () {
    assert.equal(undeep(testTarget), testTarget);
  });
  it('Returns deep members of the target object', function () {
    assert.equal(undeep(testTarget, 'childObj'), testTarget.childObj);
    assert.equal(undeep(testTarget, 'childObj', 'bool'), testTarget.childObj.bool);
  });
  // extended cases
  it('Works with wrappers', function () {
    assert.equal(undeep('string', 'length'), 6);
    assert.equal(undeep(5, 'toString'), Number.prototype.toString);
    assert.equal(undeep(true, 'toString'), Boolean.prototype.toString);
  });
  it('Works with arrays', function () {
    assert(Array.isArray(undeep(testTarget, 'childObj', 'arr')));
    assert.equal(undeep(testTarget, 'childObj', 'arr'), testTarget.childObj.arr);
    assert.equal(undeep(testTarget, 'childObj', 'arr', 'length'), 3);
    assert.equal(undeep(testTarget, 'childObj', 'arr', 0), 1);
    assert.equal(undeep(testTarget, 'childObj', 'arr', '0'), 1);
  });
  it('Works with functions', function () {
    // constructors
    assert.equal(undeep(testTarget, 'childObj', 'Array'), Array);
    assert.equal(undeep(testTarget, 'childObj', 'Array', 'name'), Array.name);
    assert.equal(undeep(testTarget, 'childObj', 'Array'), testTarget.childObj.Array);
    // instance methods
    assert.equal(undeep(testTarget, 'childObj', 'Array', 'prototype', 'slice'), [].slice);
    // anonymous functions
    assert.equal(undeep(testTarget, 'childObj', 'anon'), testTarget.childObj.anon);
    assert.equal(undeep(testTarget, 'childObj', 'anon', 'name'), testTarget.childObj.anon.name);
  });
  it('Works with circular references', function () {
    assert.equal(undeep(testTarget, 'circular', 'circular', 'circular', 'circular'), testTarget);
  });
  it('Works with getters', function () {
    assert.equal(undeep(testTarget, 'computed'), 7);
  });
  it('Takes a function for computed keys', function () {
    assert.equal(undeep([0, 1, 2, 3], function (v) { return v.length - 1; }), 3);
    assert.equal(undeep({ foo: 'bar', 0: 0 }, function (v) { return Object.keys(v)[0]; }), 0);
  });
  // error swallowing
  it('Returns undefined if any member is not found', function () {
    assert.equal(undeep(testTarget, 'undef'), undefined);
    assert.equal(undeep(testTarget, 'childObj', 'undef'), undefined);
    assert.equal(undeep(testTarget, 'childObj', 'undef', 'undef'), undefined);
  });
  it('Returns undefined if inspecting null', function () {
    assert.equal(undeep(testTarget, 'childObj', 'empty', 'illegal'), undefined);
  });
  it('Returns undefined if getter contains error', function () {
    assert.equal(undeep(testTarget, 'sabotaged'), undefined);
  });
  it('Returns undefined if key function encounters error', function () {
    assert.equal(undeep({}, function () { throw new Error('Error in key computer'); }), undefined);
  });
  // caveats
  it ('Considers any object passed as a key to be the string "[object Object]"', function() {
    var objectA = { foo: 'bar', };
    var objectB = { fizz: 'bang', };
    var testObject = { '[object Object]': 11, };
    assert.equal(undeep(testObject, objectA), 11);
    assert.equal(undeep(testObject, objectB), 11);
  });
});
describe('underp', function () {
  var consoleError, consoleWarn;
  var testTarget = {
    childObj: {
      bool: true,
      arr: [1, 0, { x: 5, y: 2 }],
      empty: null,
      Array: Array,
      anon: function () { /* do nothing */ },
    },
  };
  testTarget.circular = testTarget;
  Object.defineProperties(testTarget, {
    computed: {
      get: function () { return 7; }
    },
    sabotaged: {
      get: function () { throw new Error('Listen all y\'all it\'s a sabotage'); },
    },
  });

  beforeEach(function () {
    // stubs
    consoleError = sinon.stub(console, 'error');
    consoleWarn = sinon.stub(console, 'warn');
  });

  afterEach(function () {
    // stubs
    consoleError.restore();
    consoleWarn.restore();
  });

  // basic cases
  it('Returns the target object in the absence of additonal args', function () {
    assert.equal(underp(testTarget), testTarget);
  });
  it('Returns deep members of the target object', function () {
    assert.equal(underp(testTarget, 'childObj'), testTarget.childObj);
    assert.equal(underp(testTarget, 'childObj', 'bool'), testTarget.childObj.bool);
  });
  // error swallowing
  it('Prints error if inspecting undefined', function () {
    underp(testTarget, 'childObj', 'undef', 'undef');
    assert(consoleError.calledOnce);
  });
  it('Prints error if inspecting null', function () {
    underp(testTarget, 'childObj', 'empty', 'illegal');
    assert(consoleError.calledOnce);
  });
  it('Prints error if getter contains error', function () {
    underp(testTarget, 'sabotaged');
    assert(consoleError.calledOnce);
  });
  it('Prints error if key function encounters error', function () {
    underp({}, function () { throw new Error('Error in key computer'); });
    assert(consoleError.calledOnce);
  });
  it('Prints error if key function encounters error', function () {
    underp({}, function () { throw new Error('Error in key computer'); });
    assert(consoleError.calledOnce);
  });
  it('Warns when object key results in "[object Object]"', function () {
    underp({}, {});
    assert(consoleWarn.calledOnce);
  });
});
