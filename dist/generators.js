'use strict';

var generators = {};

generators.ALLOWABLE_DECLARATION_TYPES = ['var', 'let'];
generators.DECLARATION_TYPE = 'var';

/**
 * JavaScript Node Generators
 */

var identifier = generators.identifier = function (name) {
  return {
    type: 'Identifier',
    name: name
  };
};

var literal = generators.literal = function (value) {
  return {
    type: 'Literal',
    value: value
  };
};

var member = generators.member = function (object, property) {
  return {
    type: 'MemberExpression',
    object: identifier(object),
    property: identifier(property)
  };
};

var expressionStatement = generators.expressionStatement = function (expression) {
  return {
    type: 'ExpressionStatement',
    expression: expression
  };
};

var callExpression = generators.callExpression = function (callee, varargs) {
  var callExpression = {
    type: 'CallExpression',
    callee: callee
  };

  callExpression.arguments = varargs || [];

  return callExpression;
};

var variableDeclaration = generators.variableDeclaration = function (variable, callee, varargs) {
  return {
    type: 'VariableDeclaration',
    declarations: [{
      type: 'VariableDeclarator',
      id: identifier(variable),
      init: callExpression(callee, varargs)
    }],
    kind: generators.DECLARATION_TYPE
  };
};

var assigns = generators.assigns = function (assigner, assignee) {
  return expressionStatement({
    type: 'AssignmentExpression',
    operator: '=',
    left: assigner,
    right: assignee
  });
};

var returns = generators.returns = function (argument) {
  return {
    type: 'ReturnStatement',
    argument: argument
  };
};

var closure = generators.closure = function (body) {
  return callExpression({
    type: 'FunctionExpression',
    id: null,
    params: [],
    body: {
      type: 'BlockStatement',
      body: body
    }
  });
};

module.exports = generators;