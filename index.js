module.exports = function undeep(target) {
  try {
    return [].slice.call(arguments, 1).reduce(function (acc, key) { return acc[key]; }, target);
  } catch (e) {
    return undefined;
  }
};
