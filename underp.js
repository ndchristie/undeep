/* eslint-env node */
/* eslint-disable no-console */

module.exports = function underp(target) {
  try {
    return [].slice.call(arguments, 1).reduce(function (acc, key) {
      if (typeof key === 'object' && key !== null && key.toString() === '[object Object]') {
        console.warn('Expected key to be a primitive value or function, was [object Object]');
      }
      return typeof key === 'function' ? acc[key(acc)] : acc[key];
    }, target);
  } catch (e) {
    console.error(e);
  }
};
