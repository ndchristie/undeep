module.exports = function underp(target) {
  try {
    return [].slice.call(arguments, 1).reduce(function (acc, key) {
      return typeof key === 'function' ? acc[key(acc)] : acc[key];
    }, target);
  } catch (e) {
    return e;
  }
};
