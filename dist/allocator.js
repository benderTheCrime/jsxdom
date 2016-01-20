'use strict';

require('./Array.prototype.fill');

var ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var ALPHABET_LENGTH = ALPHABET.length;

var variableIndex = 0;

var allocator = {};

allocator.VARIABLE_PREFIX = '$$';

allocator.next = function () {
  var repetition = Math.ceil(variableIndex / ALPHABET_LENGTH);
  repetition += variableIndex % ALPHABET_LENGTH === 0 ? 1 : 0;

  var letter = ALPHABET[variableIndex % ALPHABET_LENGTH];
  var letteredComponent = Array(repetition).fill(letter).join('');

  variableIndex += 1;

  return allocator.VARIABLE_PREFIX + letteredComponent;
};

allocator.reset = function () {
  variableIndex = 0;
};

module.exports = allocator;