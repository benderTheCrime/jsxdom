'use strict';

var allocator = require('./allocator.js');

var walkers = {};

/**
 * AST Walkers
 */

walkers.CallExpression = function (node, state, c) {
  c(node.callee, state, 'Expression');

  if (node.arguments) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = node.arguments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var argument = _step.value;

        if (argument.type === 'JSXElement') {
          c(argument, { name: allocator.next(), parent: null });
        } else {
          c(argument, state, 'Expression');
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
};

walkers.ReturnStatement = function (node, state, c) {
  if (node.argument) {
    if (node.argument.type === 'JSXElement') {
      c(node.argument, {
        name: allocator.next(),
        parent: null
      });
    } else {
      c(node.argument, state, 'Expression');
    }
  }
};

walkers.VariableDeclarator = function (node, state, c) {
  c(node.id, state, 'Pattern');

  if (node.init) {
    if (node.init.type === 'JSXElement') {
      c(node.init, {
        name: allocator.next(),
        parent: null
      });
    } else {
      c(node.init, state, 'Expression');
    }
  }
};

walkers.JSXElement = function (node, state, c) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = node.openingElement.attributes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var attribute = _step2.value;

      c(attribute, state);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = node.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var child = _step3.value;

      switch (child.type) {
        case 'Literal':
          var value = child.value.replace('\n', '').trim();

          if (value.length) {
            c(child, {
              name: allocator.next(),
              parent: state.name
            });
          }
          break;
        case 'JSXExpressionContainer':
        case 'JSXElement':
          c(child, {
            name: allocator.next(),
            parent: state.name
          });
          break;
        default:
          c(child, state);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  if (state && state.parent === null) {
    allocator.reset();
  }
};

walkers.JSXExpressionContainer = function (node, state, c) {
  c(node.expression, state);
};

walkers.JSXSpreadAttribute = function () {};
walkers.JSXAttribute = function () {};

module.exports = walkers;