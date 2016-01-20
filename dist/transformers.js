'use strict';

var generators = require('./generators.js');
var compositions = require('./compositions.js');

var transformers = {};

/**
 * JSX to DOM transformers
 */

transformers.JSXAttribute = function (node, state) {
  var name = node.name.name;
  var value = node.value.expression ? node.value.expression : node.value;
  var transform = /^on/.test(name) ? compositions.addEventListener(state.name, name.substring(2).toLowerCase(), value) : compositions.setAttribute(state.name, name, value);

  for (var key in node) {
    delete node[key];
  }for (var key in transform) {
    node[key] = transform[key];
  }
};

transformers.JSXSpreadAttribute = function (node, state) {
  var value = node.argument.name;
  var transform = compositions.setAttributes(state.name, generators.identifier(value));

  for (var key in node) {
    delete node[key];
  }for (var key in transform) {
    node[key] = transform[key];
  }
};

transformers.JSXElement = function (node, state) {
  var body = [compositions.createElement(state.name, node.openingElement.name.name)].concat(node.openingElement.attributes);

  if (state.parent) {
    node.transform = body.concat(compositions.appendChild(state.parent, state.name));
  } else {
    (function flatten(node) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = node.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var child = _step.value;

          if (child.transform) body = body.concat(child.transform);
          if (child.children) flatten(child);
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
    })(node);

    body = generators.closure(body.concat(generators.returns(generators.identifier(state.name))));

    for (var key in body) {
      node[key] = body[key];
    }
  }
};

transformers.JSXExpressionContainer = function (node, state) {
  node.transform = compositions.appendChildren(state.parent, node.expression);
};

transformers.Literal = function (node, state) {
  if (state && state.parent && state.name) {
    node.transform = [compositions.createTextNode(state.name, generators.literal(node.value)), compositions.appendChild(state.parent, state.name)];
  }
};

module.exports = transformers;