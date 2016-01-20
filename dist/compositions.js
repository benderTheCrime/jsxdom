'use strict';

var generators = require('./generators.js');
var compositions = {};

/**
 * Document API compositions
 */

var attributes = { 'className': 'class' };
var properties = ['required', 'disabled'];

compositions.createElement = function (variable, tag) {
  return generators.variableDeclaration(variable, generators.member('document', 'createElement'), [generators.literal(tag)]);
};

compositions.createTextNode = function (variable, expression) {
  return generators.variableDeclaration(variable, generators.member('document', 'createTextNode'), [expression]);
};

compositions.setAttribute = function (variable, attribute, assignmentExpression) {
  var isProperty = properties.indexOf(attribute) !== -1;
  var mappedAttribute = attributes[attribute] || attribute;

  if (isProperty) {
    return generators.assigns(generators.member(variable, mappedAttribute), generators.literal(true));
  } else {
    return generators.expressionStatement(generators.callExpression(generators.member(variable, 'setAttribute'), [generators.literal(mappedAttribute), assignmentExpression]));
  }
};

compositions.setAttributes = function (variable, assignmentExpression) {
  return generators.expressionStatement(generators.callExpression(generators.member(variable, 'setAttributes'), [assignmentExpression]));
};

compositions.addEventListener = function (variable, event, expression) {
  return generators.expressionStatement(generators.callExpression(generators.member(variable, 'addEventListener'), [generators.literal(event), expression]));
};

compositions.appendChild = function (parent, child) {
  return generators.expressionStatement(generators.callExpression(generators.member(parent, 'appendChild'), [generators.identifier(child)]));
};

compositions.appendChildren = function (parent, expression) {
  return generators.expressionStatement(generators.callExpression(generators.member(parent, 'appendChildren'), [expression]));
};

module.exports = compositions;